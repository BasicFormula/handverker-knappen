from fastapi import APIRouter
from pydantic import BaseModel
import os

router = APIRouter()

class PublicContactDetails(BaseModel):
    phone_number: str

@router.get("/contact-details", response_model=PublicContactDetails)
async def get_public_contact_details():
    """
    Provides publicly safe contact information, like the company's main phone number.
    """
    phone_number = os.environ.get("TWILIO_PHONE_NUMBER") or ""
    return PublicContactDetails(phone_number=phone_number)
