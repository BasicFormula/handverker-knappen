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