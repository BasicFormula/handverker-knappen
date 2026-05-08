import asyncpg
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection, release_db_connection

router = APIRouter(prefix="/admin", tags=["Admin"])

class AdminCraftsmanProfile(BaseModel):
    user_id: str
    name: Optional[str] = None
    business_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    org_number: Optional[str] = None
    verification_status: Optional[str] = None
    verification_method: Optional[str] = None
    is_verified: Optional[bool] = None
    lead_balance: Optional[int] = None
    created_at: Optional[datetime] = None
    id_document_url: Optional[str] = None

class ActionResponse(BaseModel):
    status: str
    message: str

@router.get("/craftsmen", response_model=List[AdminCraftsmanProfile])
async def list_all_craftsmen(user: AuthorizedUser):
    """
    Lists all registered craftsmen. 
    TODO: Add strictly admin-only authorization.
    """
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            SELECT 
                user_id, 
                name, 
                email, 
                business_name, 
                org_number, 
                phone_number, 
                is_verified, 
                verification_status, 
                lead_balance, 
                created_at,
                id_document_url
            FROM craftsmen_profiles 
            ORDER BY created_at DESC
        """
        rows = await conn.fetch(query)
        
        results = []
        for row in rows:
            data = dict(row)
            data['user_id'] = str(data['user_id'])
            results.append(AdminCraftsmanProfile(**data))
            
        return results
    except Exception as e:
        print(f"Error in list_all_craftsmen: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch users: {e}")
    finally:
        if conn:
            await release_db_connection(conn)

@router.post("/craftsmen/{user_id}/approve", response_model=ActionResponse)
async def approve_craftsman(user_id: str, user: AuthorizedUser):
    """
    Approves a craftsman's manual verification.
    """
    # ... check admin permissions ...
    # For now, just check if user is verified themselves or hardcoded admin check
    # We can check if email ends in @mastersas.no or similar, or just allow for now
    
    conn = await get_db_connection()
    try:
        await conn.execute(
            "UPDATE craftsmen_profiles SET verification_status = 'approved', verification_method = 'manual_approval', bankid_verified = TRUE WHERE user_id = $1",
            user_id
        )
        return ActionResponse(status="success", message=f"Craftsman {user_id} approved.")
    except Exception as e:
        print(f"Error approving craftsman: {e}")
        raise HTTPException(status_code=500, detail="Could not approve craftsman.")
    finally:
        await release_db_connection(conn)

@router.delete("/craftsmen/{user_id}", response_model=ActionResponse)
async def delete_craftsman(user_id: str, user: AuthorizedUser):
    """
    Deletes a craftsman profile.
    """
    # ... check admin permissions ...
    
    conn = await get_db_connection()
    try:
        # Delete related data first if no cascade (or rely on cascade)
        # Assuming cascade delete on user_id foreign keys, or we just delete profile
        await conn.execute("DELETE FROM craftsmen_profiles WHERE user_id = $1", user_id)
        return ActionResponse(status="success", message=f"Craftsman {user_id} deleted.")
    except Exception as e:
        print(f"Error deleting craftsman: {e}")
        raise HTTPException(status_code=500, detail="Could not delete craftsman.")
    finally:
        await release_db_connection(conn)
