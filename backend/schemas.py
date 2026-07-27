from typing import Literal

from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(min_length=4, max_length=120)
    category: str
    location: str
    budget: str
    description: str = Field(min_length=10, max_length=1200)


class OfferCreate(BaseModel):
    craftsperson_id: str
    amount: str
    message: str = Field(min_length=10, max_length=800)


class AssignmentCreate(BaseModel):
    craftsperson_id: str
    payment_method: Literal["stripe", "vipps"]


class RatingCreate(BaseModel):
    craftsperson_id: str
    score: int = Field(ge=1, le=5)
    comment: str = Field(min_length=3, max_length=500)


class CraftspersonOnboard(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    company: str = Field(min_length=2, max_length=100)
    trade: str = Field(min_length=2, max_length=60)
    location: str = Field(min_length=2, max_length=80)
    service_areas: list[str] = Field(min_length=1, max_length=8)
    bio: str = Field(min_length=20, max_length=500)


class ReliabilityEvent(BaseModel):
    outcome: Literal["completed", "cancelled", "no_response"]