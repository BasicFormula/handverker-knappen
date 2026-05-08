import asyncpg
import cloudinary
import cloudinary.uploader
import os
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection, release_db_connection
from app.env import mode, Mode
import mimetypes

# Configure Cloudinary from environment variables
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True,
)

router = APIRouter()

# Configuration
AUTO_APPROVE_KYC = False

# --- Simplified Pydantic Models ---
class CraftsmanProfile(BaseModel):
    business_name: Optional[str] = ""
    org_number: Optional[str] = ""
    phone_number: Optional[str] = ""
    experience_level: Optional[str] = ""
    pricing_info: Optional[str] = ""
    services: Optional[List[str]] = []
    service_areas: Optional[List[str]] = []
    profile_photo_url: Optional[str] = ""
    id_document_url: Optional[str] = ""
    email: Optional[str] = ""
    is_verified: Optional[bool] = False
    verification_status: str = "pending"
    verification_method: str = "manual"
    promo_start: Optional[datetime] = None
    region: str = "Oslo"
    lead_balance: int
    rating: float = 0.0
    review_count: int = 0

class UpdateCraftsmanProfile(BaseModel):
    business_name: Optional[str] = None
    org_number: Optional[str] = None
    phone_number: Optional[str] = None
    experience_level: Optional[str] = None
    pricing_info: Optional[str] = None
    services: Optional[List[str]] = None
    service_areas: Optional[List[str]] = None
    id_document_url: Optional[str] = None
    region: Optional[str] = None

class CraftsmanPublicProfile(BaseModel):
    id: UUID
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    services_offered: List[str] = Field(default_factory=list)
    lead_balance: int

# --- API Endpoints ---
@router.get("/craftsmen/me", response_model=CraftsmanProfile)
async def get_current_craftsman_profile(user: AuthorizedUser):
    """
    Fetches the profile for the currently authenticated craftsman.
    Returns a default empty profile if one doesn't exist.
    """
    conn = None
    try:
        conn = await get_db_connection()
        # Fetch the main profile details
        profile_row = await conn.fetchrow(
            """
            SELECT user_id, business_name, org_number, phone_number, experience_level, pricing_info, profile_photo_url, id_document_url, email, is_verified, lead_balance, verification_status, verification_method, promo_start, region
            FROM craftsmen_profiles
            WHERE user_id = $1
            """,
            user.sub,
        )

        # If no profile exists, create a basic one and return
        if not profile_row:
            # Insert the new profile and retrieve it to get the ID
            new_profile = await conn.fetchrow(
                "INSERT INTO craftsmen_profiles (user_id, name, email, lead_balance, region) VALUES ($1, $2, $3, 10, 'Oslo') RETURNING *",
                user.sub,
                getattr(user, "name", None) or "New User",
                getattr(user, "email", None) or "no-email@example.com",
            )
            return CraftsmanProfile(
                email=new_profile["email"],
                is_verified=new_profile["is_verified"],
                lead_balance=new_profile["lead_balance"],
                verification_status=new_profile.get("verification_status", "pending"),
                verification_method=new_profile.get("verification_method", "manual"),
                region=new_profile.get("region", "Oslo")
            )

        profile_id = profile_row["user_id"]

        # Fetch services using the user_id
        services_rows = await conn.fetch(
            "SELECT service_name FROM craftsman_services WHERE craftsman_id = $1",
            profile_id,
        )
        services = [row["service_name"] for row in services_rows]

        # Fetch service areas using the user_id
        areas_rows = await conn.fetch(
            "SELECT location_name FROM craftsman_service_areas WHERE craftsman_id = $1",
            profile_id,
        )
        service_areas = [row["location_name"] for row in areas_rows]

        # Combine and return the full profile
        return CraftsmanProfile(
            **profile_row, services=services, service_areas=service_areas
        )

    except Exception as e:
        print(f"ERROR in get_current_craftsman_profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {e}")
    finally:
        if conn:
            await release_db_connection(conn)


@router.put("/craftsmen/profile", response_model=CraftsmanProfile)
async def update_craftsman_profile(
    profile_data: UpdateCraftsmanProfile,
    user: AuthorizedUser,
):
    """
    Creates or updates a craftsman's profile using a robust transaction.
    """
    conn = None
    try:
        conn = await get_db_connection()
        async with conn.transaction():
            # Determine new verification status if ID document is uploaded
            new_verification_status = None
            new_verification_method = None
            
            if profile_data.id_document_url:
                if AUTO_APPROVE_KYC:
                     new_verification_status = 'approved'
                else:
                     new_verification_status = 'pending'
                new_verification_method = 'manual'

            # Build the query dynamically or just use COALESCE/logic in SQL
            # For simplicity, we can fetch current status if we want to be smart, 
            # but here we can use conditional update in SQL or just set it if provided.
            
            # Note: We don't want to overwrite 'approved' with 'pending' if they just update their name, 
            # UNLESS they upload a NEW document. Here we assume if id_document_url is provided, it's a change 
            # (or re-submission). 
            
            # Let's handle the update.
            # We need to construct the update query carefully to include region and potential status changes.

            update_fields = [
                "business_name = EXCLUDED.business_name",
                "org_number = EXCLUDED.org_number",
                "phone_number = EXCLUDED.phone_number",
                "experience_level = EXCLUDED.experience_level",
                "pricing_info = EXCLUDED.pricing_info",
                "id_document_url = EXCLUDED.id_document_url",
                "name = EXCLUDED.name",
                "email = EXCLUDED.email",
                "region = COALESCE($10, craftsmen_profiles.region)" # Use existing if not provided
            ]
            
            args = [
                user.sub,
                getattr(user, "name", None) or "New User",
                getattr(user, "email", None) or "no-email@example.com",
                profile_data.business_name,
                profile_data.org_number,
                profile_data.phone_number,
                profile_data.experience_level,
                profile_data.pricing_info,
                profile_data.id_document_url,
                profile_data.region
            ]
            
            # If id_document_url is being set (not None), update status
            if profile_data.id_document_url is not None:
                update_fields.append(f"verification_status = '{new_verification_status}'")
                update_fields.append(f"verification_method = '{new_verification_method}'")
                
            update_clause = ", ".join(update_fields)
            
            # Insert assumes region is $10. We need to handle INSERT vs UPDATE logic.
            # The original code used ON CONFLICT DO UPDATE.
            
            # Since ON CONFLICT refers to EXCLUDED, we can just pass values.
            # But for verification logic, we want to change status ONLY if id_document_url is changed/provided.
            # The profile_data fields are Optional. If they are None in Python, they are None in SQL args? 
            # Wait, the original code passed them directly. 
            # If I pass None to INSERT, it inserts NULL.
            # If I pass None to UPDATE via EXCLUDED, it updates to NULL.
            # The client sends what it wants to set.
            
            # Revised approach:
            # We'll stick to the ON CONFLICT pattern but add the new fields.
            
            verification_status_update = ""
            verification_method_update = ""
            
            if profile_data.id_document_url:
                 verification_status_update = f", verification_status = '{new_verification_status}'"
                 verification_method_update = f", verification_method = '{new_verification_method}'"

            
            sql = f"""
                INSERT INTO craftsmen_profiles (user_id, name, email, business_name, org_number, phone_number, experience_level, pricing_info, id_document_url, region)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, 'Oslo'))
                ON CONFLICT (user_id) DO UPDATE
                SET business_name = EXCLUDED.business_name,
                    org_number = EXCLUDED.org_number,
                    phone_number = EXCLUDED.phone_number,
                    experience_level = EXCLUDED.experience_level,
                    pricing_info = EXCLUDED.pricing_info,
                    id_document_url = EXCLUDED.id_document_url,
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    region = COALESCE(EXCLUDED.region, craftsmen_profiles.region)
                    {verification_status_update}
                    {verification_method_update}
            """
            
            await conn.execute(
                sql,
                user.sub,
                getattr(user, "name", None) or "New User",
                getattr(user, "email", None) or "no-email@example.com",
                profile_data.business_name,
                profile_data.org_number,
                profile_data.phone_number,
                profile_data.experience_level,
                profile_data.pricing_info,
                profile_data.id_document_url,
                profile_data.region,
            )

            # Step 2: Clear existing services and areas for this user
            await conn.execute(
                "DELETE FROM craftsman_services WHERE craftsman_id = $1", user.sub
            )
            await conn.execute(
                "DELETE FROM craftsman_service_areas WHERE craftsman_id = $1", user.sub
            )

            # Step 3: Insert new services
            if profile_data.services:
                services_data = [
                    (user.sub, service) for service in profile_data.services
                ]
                await conn.copy_records_to_table(
                    "craftsman_services",
                    records=services_data,
                    columns=("craftsman_id", "service_name"),
                )

            # Step 4: Insert new service areas
            if profile_data.service_areas:
                areas_data = [
                    (user.sub, area) for area in profile_data.service_areas
                ]
                await conn.copy_records_to_table(
                    "craftsman_service_areas",
                    records=areas_data,
                    columns=("craftsman_id", "location_name"),
                )

        # Step 5: Fetch and return the complete, updated profile
        # We need a new connection context for the get profile function
        return await get_current_craftsman_profile(user)

    except Exception as e:
        # The transaction will be rolled back automatically
        print(f"ERROR in update_craftsman_profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile.")
    finally:
        if conn:
            await release_db_connection(conn)

@router.post("/craftsmen/upload-profile-photo")
async def upload_profile_photo(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        result = cloudinary.uploader.upload(
            file_content,
            folder="handverker/profile_photos",
            public_id=f"public_profile_{uuid4()}",
            overwrite=True,
            resource_type="image",
        )
        url = result.get("secure_url")
        return {"profile_photo_url": url}
    except Exception as e:
        print(f"Error uploading profile photo: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload profile photo")


@router.post("/craftsmen/upload-id-document")
async def upload_id_document(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        result = cloudinary.uploader.upload(
            file_content,
            folder="handverker/id_documents",
            public_id=f"private_id_{uuid4()}",
            overwrite=True,
            resource_type="image",
            # Keep ID documents private (not publicly accessible by URL)
            type="authenticated",
        )
        url = result.get("secure_url")
        return {"id_document_url": url}
    except Exception as e:
        print(f"Error uploading ID document: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload ID document")


@router.get("/craftsmen/search", response_model=List[CraftsmanPublicProfile])
async def search_craftsmen(
    searchTerm: Optional[str] = None,
    services: Optional[List[str]] = Query(None),
    areas: Optional[List[str]] = Query(None),
):
    """
    Searches for craftsmen based on a search term, services offered, and service areas.
    """
    conn = None
    try:
        conn = await get_db_connection()
        query = """
            SELECT DISTINCT
                cp.user_id as id,
                cp.business_name as company_name,
                cp.phone_number,
                cp.bio,
                cp.profile_photo_url as profile_picture_url,
                COALESCE((SELECT array_agg(service_name) FROM craftsman_services WHERE craftsman_id = cp.user_id), '{}') as services_offered,
                cp.lead_balance
            FROM 
                craftsmen_profiles cp
            LEFT JOIN 
                craftsman_services cs ON cp.user_id = cs.craftsman_id
            LEFT JOIN 
                craftsman_service_areas csa ON cp.user_id = csa.craftsman_id
            WHERE 1=1
        """
        params = []

        if searchTerm:
            params.append(f"%{searchTerm}%")
            query += f" AND (cp.business_name ILIKE ${len(params)} OR cp.bio ILIKE ${len(params)})"

        if services:
            params.append(list(services))
            query += f" AND cs.service_name = ANY(${len(params)})"

        if areas:
            params.append(list(areas))
            query += f" AND csa.location_name = ANY(${len(params)})"

        rows = await conn.fetch(query, *params)

        return [CraftsmanPublicProfile(**row) for row in rows]

    except Exception as e:
        print(f"ERROR in search_craftsmen: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    finally:
        if conn:
            await release_db_connection(conn)

@router.get("/craftsmen/{craftsman_id}", response_model=CraftsmanPublicProfile)
async def get_craftsman_profile_by_id(craftsman_id: str):
    """
    Fetches the public profile for a specific craftsman by their ID.
    """
    conn = None
    try:
        conn = await get_db_connection()
        profile_row = await conn.fetchrow(
            """
            SELECT
                cp.user_id as id,
                cp.business_name as company_name,
                cp.phone_number,
                cp.bio,
                cp.profile_photo_url as profile_picture_url,
                COALESCE((SELECT array_agg(service_name) FROM craftsman_services WHERE craftsman_id = cp.user_id), '{}') as services_offered,
                cp.lead_balance
            FROM 
                craftsmen_profiles cp
            WHERE 
                cp.user_id = $1
            """,
            craftsman_id,
        )

        if not profile_row:
            raise HTTPException(status_code=404, detail="Craftsman not found")

        return CraftsmanPublicProfile(**profile_row)

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in get_craftsman_profile_by_id: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch craftsman profile.")
    finally:
        if conn:
            await release_db_connection(conn)
