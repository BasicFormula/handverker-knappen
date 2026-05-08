from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import httpx
from jose import jwt, JWTError
from datetime import datetime, timedelta
import urllib.parse
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection, release_db_connection
from app.libs.urls import get_frontend_base_url

router = APIRouter()

# This should be a securely generated secret, stored in environment variables
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "a_secure_secret_key_that_should_be_changed")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 5

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


class InitiateVerificationRequest(BaseModel):
    ssn: str | None = None
    method: str = "bankid" # "bankid" or "vipps"


class InitiateVerificationResponse(BaseModel):
    redirectUri: str
    state: str

class FinalizeVerificationRequest(BaseModel):
    code: str
    state: str

@router.post("/initiate-bankid-verification", response_model=InitiateVerificationResponse)
async def initiate_bankid_verification(
    request: InitiateVerificationRequest, user: AuthorizedUser
):
    """
    Initiates a BankID verification process for the logged-in craftsman.
    This endpoint communicates with the Criipto API to create a verification session.
    """
    # The callback URI that Criipto will redirect back to (Frontend URL)
    callback_uri = f"{get_frontend_base_url()}/bankid-callback-page"
    
    # Generate state token to verify the callback
    state_token = create_access_token(data={"sub": user.sub, "ssn": request.ssn})
    
    # Construct the Criipto Authorization URL
    criipto_domain = os.environ.get("CRIIPTO_DOMAIN", "").replace("https://", "").replace("http://", "").strip("/")
    client_id = os.environ.get("CRIIPTO_CLIENT_ID")
    
    if not criipto_domain or not client_id:
        # Fallback for dev if secrets not set
        print("WARNING: Criipto credentials missing in environment variables.")
        
    base_url = f"https://{criipto_domain}/oauth2/authorize"
    
    acr_values = "urn:grn:authn:no:bankid"
    if request.method == "vipps":
        acr_values = "urn:grn:authn:no:vipps"

    params = {
        "client_id": client_id,
        "redirect_uri": callback_uri,
        "response_type": "code",
        "scope": "openid",
        "acr_values": acr_values,
        "state": state_token
    }
    
    auth_url = f"{base_url}?{urllib.parse.urlencode(params)}"

    return InitiateVerificationResponse(
        redirectUri=auth_url, state=state_token
    )


@router.post("/finalize-bankid-verification")
async def finalize_bankid_verification(request: FinalizeVerificationRequest, user: AuthorizedUser):
    """
    Finalizes the verification process. 
    Called by the frontend after receiving the code and state from Criipto.
    """
    code = request.code
    state = request.state

    try:
        payload = jwt.decode(state, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id_from_state = payload.get("sub")
        if user_id_from_state is None:
            raise HTTPException(
                status_code=400, detail="Invalid state token: user_id missing"
            )
        
        # Verify that the user finalizing the request is the same as the one who initiated it
        if user_id_from_state != user.sub:
             raise HTTPException(
                status_code=403, detail="State token does not match authenticated user"
            )

    except JWTError:
        raise HTTPException(
            status_code=400, detail="Invalid state token: could not decode"
        )

    token_url = f"https://{os.environ.get('CRIIPTO_DOMAIN', '').replace('https://', '').replace('http://', '').strip('/')}/oauth2/token"
    # The redirect_uri MUST match what was used in the authorize request
    redirect_uri = f"{get_frontend_base_url()}/bankid-callback-page"

    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": os.environ.get("CRIIPTO_CLIENT_ID"),
        "client_secret": os.environ.get("CRIIPTO_CLIENT_SECRET"),
    }

    async with httpx.AsyncClient() as client:
        try:
            token_response = await client.post(token_url, data=token_data)
            token_response.raise_for_status()
        except httpx.HTTPStatusError as e:
            print(f"Token exchange failed: {e.response.text}")
            raise HTTPException(
                status_code=400, detail="Failed to fetch token from Criipto"
            )

    # At this point, the token is received. Verification successful.

    # Update the user's profile in the database
    conn = await get_db_connection()
    try:
        await conn.execute(
            "UPDATE craftsmen_profiles SET bankid_verified = TRUE, verification_status = 'approved', verification_method = 'bankid' WHERE user_id = $1",
            user.sub,
        )
    finally:
        await release_db_connection(conn)

    return {"status": "success", "message": "BankID verification successful"}
