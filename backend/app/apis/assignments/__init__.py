from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import asyncpg
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection, release_db_connection
from app.env import mode, Mode


# Initialize the router
router = APIRouter(prefix="/assignments", tags=["Assignments"])

# --- Pydantic Models ---

class CreateAssignmentRequest(BaseModel):
    category: str
    description: str

class Interest(BaseModel):
    craftsman_id: UUID
    business_name: Optional[str] = None
    profile_photo_url: Optional[str] = None
    created_at: datetime

class SelectCraftsmanRequest(BaseModel):
    assignment_id: int
    craftsman_user_id: UUID

class AssignmentResponse(BaseModel):
    id: int
    headline: Optional[str] = None
    detailed_description: Optional[str] = None
    location: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    selected_craftsman_id: Optional[UUID] = None
    customer_id: Optional[UUID] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    required_services: List[str] = []
    is_reviewed: bool = False
    relationship: Optional[str] = None
    interested_craftsmen: List[Interest] = []


# --- API Endpoints ---

@router.get("/", response_model=list[AssignmentResponse])
async def list_open_assignments(user: AuthorizedUser):
    """
    Lists all assignments with 'open' status, newest first.
    Accessible only by authenticated users.
    NOTE: Customer phone number is hidden in this public list for privacy.
    """
    conn = None
    try:
        conn = await get_db_connection()
        # Removed customer_phone from selection
        query = """
            SELECT id, headline, detailed_description, location, status, created_at, updated_at, selected_craftsman_id, customer_id, customer_name, customer_email, required_services
            FROM assignments
            WHERE status = 'open'
            ORDER BY created_at DESC
        """
        open_assignments = await conn.fetch(query)
        return [AssignmentResponse(**dict(row)) for row in open_assignments]
    except Exception as e:
        print(f"Error listing open assignments: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred while fetching assignments.")
    finally:
        if conn:
            await release_db_connection(conn)


@router.get("/my-assignments", response_model=list[AssignmentResponse])
async def get_my_assignments(user: AuthorizedUser):
    """
    Fetches all assignments created by the currently authenticated user (customer).
    It also checks if a review has been submitted for each assignment.
    """
    user_id = user.sub
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            SELECT
                a.id,
                a.headline,
                a.detailed_description,
                a.status,
                a.created_at,
                a.updated_at,
                a.selected_craftsman_id,
                a.customer_id,
                a.location,
                a.customer_name,
                a.customer_email,
                a.customer_phone,
                a.required_services,
                CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_reviewed,
                COALESCE(
                    (
                        SELECT json_agg(json_build_object(
                            'craftsman_id', cp.user_id,
                            'business_name', cp.business_name,
                            'profile_photo_url', cp.profile_photo_url,
                            'created_at', e.created_at
                        ))
                        FROM expressions_of_interest e
                        JOIN craftsmen_profiles cp ON e.craftsman_id = cp.user_id
                        WHERE e.assignment_id = a.id
                    ),
                    '[]'::json
                ) AS interested_craftsmen
            FROM assignments a
            LEFT JOIN reviews r ON a.id = r.assignment_id
            WHERE a.customer_id = $1
            ORDER BY a.created_at DESC
        """
        assignments = await conn.fetch(query, user_id)
        
        results = []
        for row in assignments:
            row_dict = dict(row)
            # Parse the JSON string if it's a string, asyncpg might return it as a list of dicts or string depending on setup
            # asyncpg usually returns json as str unless configured otherwise, but json_agg returns distinct types?
            # Actually asyncpg decodes json automatically if type codec is set, but let's assume it returns a string or list.
            # json_build_object usually returns jsonb which asyncpg decodes to python objects (list/dict).
            
            if row_dict.get('interested_craftsmen') is None:
                row_dict['interested_craftsmen'] = []
            elif isinstance(row_dict['interested_craftsmen'], str):
                 import json
                 row_dict['interested_craftsmen'] = json.loads(row_dict['interested_craftsmen'])
            
            results.append(AssignmentResponse(**row_dict))
            
        return results
    except Exception as e:
        print(f"Error fetching user assignments: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch assignments.")
    finally:
        if conn:
            await release_db_connection(conn)

@router.post("/select-craftsman", response_model=AssignmentResponse)
async def select_craftsman(request: SelectCraftsmanRequest, user: AuthorizedUser):
    """
    Allows a customer to select a craftsman for their assignment.
    """
    customer_id = UUID(user.sub)
    conn = None
    try:
        conn = await get_db_connection()
        
        # Verify ownership and status
        assignment = await conn.fetchrow(
            "SELECT id, status FROM assignments WHERE id = $1 AND customer_id = $2",
            request.assignment_id, customer_id
        )
        
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found or permission denied.")
        
        if assignment['status'] != 'open':
             raise HTTPException(status_code=400, detail="Assignment is not open for selection.")
             
        # Update assignment
        updated_assignment = await conn.fetchrow(
            """
            UPDATE assignments
            SET status = 'assigned', selected_craftsman_id = $1
            WHERE id = $2
            RETURNING id, headline, detailed_description, location, status, created_at, updated_at, selected_craftsman_id, customer_id, customer_name, customer_email, customer_phone, required_services
            """,
            request.craftsman_user_id, request.assignment_id
        )
        
        # We need to construct the response, ensuring interested_craftsmen is present (empty list or fetched)
        # For simplicity, we return empty list here as the selection is done.
        
        response_dict = dict(updated_assignment)
        response_dict['interested_craftsmen'] = [] # Or fetch if needed
        
        return AssignmentResponse(**response_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error selecting craftsman: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
    finally:
         if conn:
            await release_db_connection(conn)


@router.get("/craftsman-assignments", response_model=list[AssignmentResponse])
async def get_craftsman_assignments(user: AuthorizedUser):
    """
    Fetches all assignments a craftsman is either assigned to or has shown interest in.
    """
    craftsman_id = user.sub
    conn = None
    try:
        conn = await get_db_connection()

        # Query for assignments where the craftsman is assigned OR interested
        query = """
            SELECT 
                a.id,
                a.headline,
                a.detailed_description,
                a.location,
                a.status,
                a.created_at,
                a.updated_at,
                a.selected_craftsman_id,
                a.customer_id,
                a.customer_name,
                a.customer_email,
                a.customer_phone,
                a.required_services,
                CASE 
                    WHEN a.selected_craftsman_id = $1 THEN 'assigned'
                    ELSE 'interested'
                END as relationship
            FROM assignments a
            LEFT JOIN expressions_of_interest e ON a.id = e.assignment_id AND e.craftsman_id = $1
            WHERE a.selected_craftsman_id = $1 OR e.craftsman_id = $1
            ORDER BY a.created_at DESC
        """

        records = await conn.fetch(query, craftsman_id)
        
        results = []
        for row in records:
            data = dict(row)
            # Privacy check for phone number
            # If not assigned (relationship='interested'), hide phone
            if data['relationship'] != 'assigned':
                data['customer_phone'] = None
            
            results.append(AssignmentResponse(**data))

        return results

    except Exception as e:
        print(f"Error fetching craftsman assignments: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch assignments.")
    finally:
        if conn:
            await release_db_connection(conn)


@router.get("/{assignment_id}", response_model=AssignmentResponse)
async def get_assignment_by_id(assignment_id: int, user: AuthorizedUser):
    """
    Fetches a single assignment by its ID.
    Accessible only by authenticated users.
    Phone number is only revealed to the customer (owner) or the selected craftsman.
    Includes interest status for the requesting craftsman.
    """
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            SELECT id, headline, detailed_description, location, status, created_at, updated_at, selected_craftsman_id, customer_id, customer_name, customer_email, customer_phone, required_services
            FROM assignments
            WHERE id = $1
        """
        assignment = await conn.fetchrow(query, assignment_id)
        
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found.")
            
        data = dict(assignment)
        
        user_id = str(user.sub)
        customer_id = str(data.get('customer_id'))
        selected_craftsman_id = str(data.get('selected_craftsman_id')) if data.get('selected_craftsman_id') else None
        
        is_owner = user_id == customer_id
        is_selected_craftsman = user_id == selected_craftsman_id
        
        # Privacy Check: Hide phone number if not authorized
        if not (is_owner or is_selected_craftsman):
            data['customer_phone'] = None

        # Check interest for the requesting user
        if not is_owner:
             interest_check = await conn.fetchrow(
                 "SELECT craftsman_id, created_at FROM expressions_of_interest WHERE assignment_id = $1 AND craftsman_id = $2",
                 assignment_id, user.sub
             )
             if interest_check:
                 # Populate interested_craftsmen with just this user's interest so frontend knows
                 # We need to construct Interest object. business_name/profile_photo not needed for "Am I interested?" check usually, but good to have.
                 # For simplicity, we just pass the ID and time.
                 data['interested_craftsmen'] = [{
                     'craftsman_id': interest_check['craftsman_id'],
                     'created_at': interest_check['created_at'],
                     'business_name': None, # Optional
                     'profile_photo_url': None # Optional
                 }]

        return AssignmentResponse(**data)

    except HTTPException:
        raise  # Re-raise HTTPException to prevent it from being caught as a generic error
    except Exception as e:
        print(f"Error fetching assignment by ID: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
    finally:
        if conn:
            await release_db_connection(conn)


@router.post("/", response_model=AssignmentResponse)
async def create_assignment(
    assignment_data: CreateAssignmentRequest, user: AuthorizedUser
):
    """
    Creates a new assignment for the authenticated user.
    """
    customer_id = UUID(user.sub)  # Re-enabled dynamic user ID
    customer_email = user.email # Access email directly
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            INSERT INTO assignments (customer_id, headline, detailed_description, customer_email)
            VALUES ($1, $2, $3, $4)
            RETURNING id, customer_id, headline, detailed_description, status, created_at, updated_at, selected_craftsman_id, customer_email, customer_name, customer_phone, required_services
        """
        new_assignment = await conn.fetchrow(
            query,
            customer_id,
            assignment_data.category,
            assignment_data.description,
            customer_email,
        )
        if not new_assignment:
            raise HTTPException(
                status_code=500, detail="Failed to create assignment in the database."
            )

        # Manually map headline and detailed_description back to the response model's fields
        # Not needed anymore if we select headline/detailed_description in RETURNING, but the INSERT uses category/description from request?
        # The frontend sends category and description. The DB has headline and detailed_description.
        # We are inserting category -> headline, description -> detailed_description.
        
        response_data = dict(new_assignment)
        # response_data['headline'] = new_assignment['headline'] 
        # response_data['detailed_description'] = new_assignment['detailed_description']
        
        return AssignmentResponse(**response_data)

    except Exception as e:
        print(f"Error creating assignment: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred while creating the assignment.")
    finally:
        if conn:
            await release_db_connection(conn)


@router.post("/{assignment_id}/interest", response_model=AssignmentResponse)
async def register_interest(assignment_id: int, user: AuthorizedUser):
    """
    Allows a craftsman to express interest in an open assignment.
    """
    craftsman_id = user.sub
    conn = None
    try:
        conn = await get_db_connection()

        # Check if assignment exists and is open
        assignment = await conn.fetchrow(
            "SELECT id, status FROM assignments WHERE id = $1",
            assignment_id
        )
        
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found.")
            
        if assignment['status'] != 'open':
            raise HTTPException(status_code=400, detail="This assignment is no longer open for interest.")

        # Insert into expressions_of_interest (ignore if already exists)
        await conn.execute(
            """
            INSERT INTO expressions_of_interest (assignment_id, craftsman_id)
            VALUES ($1, $2)
            ON CONFLICT (assignment_id, craftsman_id) DO NOTHING
            """,
            assignment_id, craftsman_id
        )
        
        # Return the updated assignment (using get_assignment_by_id logic or similar)
        # We can just return the basic info, get_assignment_by_id will handle privacy.
        # But we need to match the Response Model.
        
        # Let's fetch the full object again to be safe and consistent
        # We can reuse the query logic from get_assignment_by_id but we can't call the route function directly easily.
        # So we repeat the fetch.
        
        query = """
            SELECT id, headline, detailed_description, location, status, created_at, updated_at, selected_craftsman_id, customer_id, customer_name, customer_email, customer_phone, required_services
            FROM assignments
            WHERE id = $1
        """
        updated_assignment = await conn.fetchrow(query, assignment_id)
        
        data = dict(updated_assignment)
        
        # Privacy Logic (Same as get_assignment_by_id)
        # Since the user is the craftsman expressing interest, they are NOT the selected craftsman yet.
        # So phone should be hidden.
        user_id = str(user.sub)
        customer_id = str(data.get('customer_id'))
        selected_craftsman_id = str(data.get('selected_craftsman_id')) if data.get('selected_craftsman_id') else None
        
        if not (user_id == customer_id or user_id == selected_craftsman_id):
            data['customer_phone'] = None
            
        return AssignmentResponse(**data)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error registering interest: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
    finally:
        if conn:
            await release_db_connection(conn)
