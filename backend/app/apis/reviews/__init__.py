from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import asyncpg
from uuid import UUID
from datetime import datetime

from app.auth import AuthorizedUser
from app.libs.database import get_db_connection, release_db_connection
from app.env import mode, Mode

router = APIRouter(prefix="/reviews", tags=["Reviews"])

# --- Pydantic Models ---
class Review(BaseModel):
    id: UUID
    assignment_id: int
    customer_id: UUID
    craftsman_id: UUID
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    created_at: datetime
    customer_name: Optional[str] = None

class CreateReviewRequest(BaseModel):
    assignment_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

# --- API Endpoints ---
@router.post("/", response_model=Review)
async def submit_review(
    review_data: CreateReviewRequest,
    user: AuthorizedUser,
):
    """
    Submits a review for a completed assignment.
    A user can only review an assignment once.
    """
    customer_id = UUID(user.sub)
    conn = None
    try:
        conn = await get_db_connection()
        
        # 1. Verify the assignment exists and the current user is the customer
        assignment = await conn.fetchrow(
            "SELECT id, customer_id, selected_craftsman_id FROM assignments WHERE id = $1",
            review_data.assignment_id,
        )
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found.")
        
        if assignment['customer_id'] != customer_id:
            raise HTTPException(status_code=403, detail="You can only review your own assignments.")

        if not assignment['selected_craftsman_id']:
             raise HTTPException(status_code=400, detail="Cannot review an assignment without an assigned craftsman.")
        
        craftsman_id = assignment['selected_craftsman_id']

        # 2. Check if a review for this assignment already exists
        existing_review = await conn.fetchval(
            "SELECT id FROM reviews WHERE assignment_id = $1 AND customer_id = $2",
            review_data.assignment_id,
            customer_id
        )
        if existing_review:
            raise HTTPException(status_code=409, detail="A review for this assignment has already been submitted.")

        # 3. Insert the new review
        query = """
            INSERT INTO reviews (assignment_id, customer_id, craftsman_id, rating, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, assignment_id, customer_id, craftsman_id, rating, comment, created_at
        """
        
        new_review = await conn.fetchrow(
            query,
            review_data.assignment_id,
            customer_id,
            craftsman_id,
            review_data.rating,
            review_data.comment,
        )
        
        if not new_review:
            raise HTTPException(status_code=500, detail="Failed to save review.")

        # 4. Fetch customer name for the response
        customer_name = user.name or "Anonym"
        
        review_response = dict(new_review)
        review_response["customer_name"] = customer_name

        return Review(**review_response)

    except asyncpg.UniqueViolationError:
        # This is a fallback, the explicit check is better for UX
        raise HTTPException(status_code=409, detail="A review for this assignment has already been submitted.")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error submitting review: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
    finally:
        if conn:
            await release_db_connection(conn)

@router.get("/my-reviews", response_model=List[Review])
async def get_my_reviews(user: AuthorizedUser):
    """
    Fetches all reviews submitted by the currently authenticated user.
    """
    customer_id = UUID(user.sub)
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            SELECT
                r.id,
                r.assignment_id,
                r.customer_id,
                r.craftsman_id,
                r.rating,
                r.comment,
                r.created_at,
                u.name as customer_name
            FROM reviews r
            LEFT JOIN neon_auth.users_sync u ON r.customer_id = u.id::uuid
            WHERE r.customer_id = $1
            ORDER BY r.created_at DESC
        """
        reviews_rows = await conn.fetch(query, customer_id)
        return [Review(**dict(row)) for row in reviews_rows]
    except Exception as e:
        print(f"Error fetching my reviews: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch your reviews.")
    finally:
        if conn:
            await release_db_connection(conn)


@router.get("/craftsman/{craftsman_id}", response_model=List[Review])
async def get_reviews_for_craftsman(craftsman_id: UUID):
    """
    Fetches all reviews for a specific craftsman.
    Includes the customer's name for display purposes.
    """
    conn = None
    try:
        conn = await get_db_connection()
        
        # Query to join reviews with user data to get customer names
        # NOTE: This assumes user data is accessible. The table name 'users' and schema might be different.
        # This cross-schema query might not work as intended.
        query = """
            SELECT
                r.id,
                r.assignment_id,
                r.customer_id,
                r.craftsman_id,
                r.rating,
                r.comment,
                r.created_at,
                u.name as customer_name
            FROM reviews r
            LEFT JOIN neon_auth.users_sync u ON r.customer_id = u.id::uuid
            WHERE r.craftsman_id = $1
            ORDER BY r.created_at DESC
        """
        
        reviews_rows = await conn.fetch(query, craftsman_id)
        
        return [Review(**dict(row)) for row in reviews_rows]

    except Exception as e:
        print(f"Error fetching reviews for craftsman: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch reviews.")
    finally:
        if conn:
            await release_db_connection(conn)
