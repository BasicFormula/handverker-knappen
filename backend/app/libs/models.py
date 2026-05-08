from pydantic import BaseModel
from typing import List

class Assignment(BaseModel):
    headline: str
    detailed_description: str
    location: str
    customer_name: str
    customer_email: str
    customer_phone: str
    required_services: List[str]

class AssignmentDetails(Assignment):
    id: int
    status: str
    created_at: str
    updated_at: str
