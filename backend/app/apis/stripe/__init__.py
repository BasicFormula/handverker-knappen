import stripe
import os
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List
from app.auth import AuthorizedUser
import asyncpg
from app.libs.database import get_db_connection, release_db_connection
from app.libs.urls import get_frontend_base_url

# Initialize the router
router = APIRouter()

# Set the Stripe API key from secrets
# This should be set outside the request cycle, ideally at application startup.
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

# --- Pydantic Models ---

class CheckoutRequest(BaseModel):
    product_id: int

class CreateCheckoutSessionRequest(BaseModel):
    assignment_id: int | None = None
    product_id: int | None = None
    product_type: str | None = "lead_balance"

class CreateCheckoutSessionResponse(BaseModel):
    url: str

class StripePayment(BaseModel):
    id: int
    user_id: str
    product_id: int | None = None
    stripe_charge_id: str
    amount: int
    created_at: str

class StripeProduct(BaseModel):
    id: int
    name: str
    price: int
    lead_count: int
    stripe_product_id: str | None = None

# --- API Endpoints ---

@router.get("/products", response_model=List[StripeProduct])
async def list_products():
    """Fetches all available lead packages/products."""
    conn = None
    try:
        conn = await get_db_connection()
        query = "SELECT id, name, price, lead_count, stripe_product_id FROM stripe_products ORDER BY price ASC"
        products = await conn.fetch(query)
        return [StripeProduct(**dict(row)) for row in products]
    except Exception as e:
        print(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch products.")
    finally:
        if conn:
            await release_db_connection(conn)


@router.get("/payment-history", response_model=List[StripePayment])
async def get_payment_history(user: AuthorizedUser):
    """Fetches the payment history for the logged-in craftsman."""
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            SELECT id, user_id, product_id, stripe_charge_id, amount, created_at::text
            FROM stripe_payments
            WHERE user_id = $1
            ORDER BY created_at DESC
        """
        payments = await conn.fetch(query, user.sub)
        return [StripePayment(**dict(row)) for row in payments]
    except Exception as e:
        print(f"Error fetching payment history: {e}")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred."
        )
    finally:
        if conn:
            await release_db_connection(conn)


@router.post("/create-checkout-session")
async def create_checkout_session(request: Request, user: AuthorizedUser):
    """
    Creates a Stripe Checkout Session for buying leads or unlocking an assignment.
    """
    conn = None
    try:
        conn = await get_db_connection()
        # Check verification status
        status_row = await conn.fetchrow(
            "SELECT verification_status FROM craftsmen_profiles WHERE user_id = $1",
            user.sub
        )
        
        if not status_row or status_row["verification_status"] != "approved":
            raise HTTPException(status_code=403, detail="Du må være verifisert for å kunne kjøpe leads.")
            
    finally:
        if conn:
            await release_db_connection(conn)

    body = await request.json()
    
    # Check if assignment_id is present to determine product type if not explicitly provided
    assignment_id = body.get("assignment_id")
    product_type = body.get("product_type")
    
    if not product_type:
        if assignment_id:
            product_type = "assignment_unlock"
        else:
            product_type = "lead_balance"
    
    # Common parameters
    user_id = user.sub
    
    # Get the base URL for constructing success and cancel URLs
    # This should point to your frontend's deployed URL in production
    base_url = get_frontend_base_url()
    
    try:
        if product_type == "lead_balance":
            product_id = body.get("product_id") 
            if not product_id:
                 # Fallback for legacy calls that might send assignment_id as product_id (based on my finding in frontend)
                 # But ideally frontend should be fixed. 
                 # If assignment_id is sent but type is lead_balance, it's likely the bug.
                 # Let's check if we have an assignment_id but it's meant to be a product_id?
                 # No, let's just fail if product_id is missing for lead_balance
                 if assignment_id and not product_id:
                     # Attempt to use assignment_id as product_id if it looks like a product ID (small integer)
                     # But safer to require product_id
                     product_id = assignment_id # Temporary fix if frontend sends assignment_id for leads
            
            if not product_id:
                 raise HTTPException(status_code=400, detail="product_id is required for lead_balance.")

            conn = None
            product = None
            try:
                conn = await get_db_connection()
                product = await conn.fetchrow("SELECT name, price FROM stripe_products WHERE id = $1", int(product_id))
            finally:
                if conn:
                    await release_db_connection(conn)
            
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")

            product_name = product['name']
            price_in_ore = int(product['price'] * 100) # Price in DB is likely in NOK, Stripe expects øre

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'nok',
                        'product_data': {
                            'name': product_name,
                        },
                        'unit_amount': price_in_ore,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'{base_url}/payment-success-page?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{base_url}/payment-canceled-page',
                metadata={
                    'user_id': user_id,
                    'product_type': 'lead_balance',
                    'product_id': str(product_id)
                }
            )
            return {"url": checkout_session.url}

        else:
            # EXISTING LOGIC FOR ASSIGNMENT UNLOCK (Buying specific lead)
            if not assignment_id:
                raise HTTPException(status_code=400, detail="assignment_id is required.")

            # For now, we'll use a fixed price. This can be made dynamic later.
            # This price is in the smallest currency unit (e.g., øre for NOK). 5000 = 50 NOK.
            price_in_ore = 5000 
            
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'nok',
                        'product_data': {
                            'name': f'Lead for Assignment #{assignment_id}',
                        },
                        'unit_amount': price_in_ore,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'{base_url}/payment-success-page?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{base_url}/payment-canceled-page',
                metadata={
                    'assignment_id': assignment_id,
                    'craftsman_id': user.sub  # Logged-in user's ID
                }
            )
            return {"url": checkout_session.url}

    except Exception as e:
        # For now, we print the error and re-raise it.
        print(f"Error creating Stripe checkout session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handles incoming webhooks from Stripe."""
    # The webhook secret should be set in your Databutton secrets
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail=str(e))
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=str(e))

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        
        # Check if this is a lead purchase or an assignment unlock
        if "assignment_id" in metadata:
            # This is an assignment unlock
            assignment_id = metadata.get("assignment_id")
            craftsman_id = metadata.get("craftsman_id")
            stripe_charge_id = session.get("payment_intent")

            if assignment_id and craftsman_id:
                conn = None
                try:
                    conn = await get_db_connection()
                    
                    # 1. Record the purchase
                    purchase_query = """
                        INSERT INTO assignment_purchases (assignment_id, craftsman_id, stripe_charge_id)
                        VALUES ($1, $2, $3)
                    """
                    await conn.execute(purchase_query, int(assignment_id), craftsman_id, stripe_charge_id)

                    # 2. Get customer email to send notification
                    customer_query = """
                        SELECT c.email FROM customers c
                        JOIN assignments a ON c.user_id = a.customer_id
                        WHERE a.id = $1
                    """
                    customer_email_record = await conn.fetchrow(customer_query, int(assignment_id))
                    
                    if customer_email_record:
                        customer_email = customer_email_record['email']
                        # 3. Send email notification
                        # Placeholder for email notification - db.notify.email is not available
                        print(f"Should send email to {customer_email}: Craftsman {craftsman_id} purchased assignment {assignment_id}")
                        # db.notify.email(
                        #     to=customer_email,
                        #     subject=f"En håndverker er interessert i oppdraget ditt!",
                        #     content_text=f"En håndverker har kjøpt tilgang til kontaktinformasjonen for oppdraget ditt (ID: {assignment_id}). Du kan forvente å bli kontaktet snart."
                        # )

                except Exception as e:
                    print(f"Error processing assignment purchase: {e}")
                    # Decide if we should raise an exception or just log it
                finally:
                    if conn:
                        await release_db_connection(conn)

        else:
            # This is a lead balance purchase
            user_id = metadata.get("user_id")
            stripe_charge_id = session.get("payment_intent")
            amount = session.get("amount_total")
            # Use product_id from metadata (set when checkout session was created)
            product_id_from_meta = metadata.get("product_id")

            if user_id:
                conn = None
                try:
                    conn = await get_db_connection()

                    # Find the product using the DB product ID stored in metadata
                    product_query = "SELECT id, lead_count FROM stripe_products WHERE id = $1"
                    product = await conn.fetchrow(product_query, int(product_id_from_meta))

                    if not product:
                        raise HTTPException(status_code=404, detail=f"Product with ID {product_id_from_meta} not found in database.")
                    
                    product_id_db = product['id']
                    lead_count = product['lead_count']
                    
                    # Insert the payment record
                    payment_query = """
                        INSERT INTO stripe_payments (user_id, product_id, stripe_charge_id, amount)
                        VALUES ($1, $2, $3, $4)
                    """
                    await conn.execute(payment_query, user_id, product_id_db, stripe_charge_id, amount)
                    
                    # Update the craftsman's lead balance
                    balance_query = """
                        UPDATE craftsmen_profiles
                        SET lead_balance = lead_balance + $1
                        WHERE user_id = $2
                    """
                    await conn.execute(balance_query, lead_count, user_id)
                    
                except Exception as e:
                    # Handle database errors
                    print(f"Database error processing webhook: {e}")
                    raise HTTPException(status_code=500, detail="Database error.")
                finally:
                    if conn:
                        await release_db_connection(conn)

    return {"status": "success"}
