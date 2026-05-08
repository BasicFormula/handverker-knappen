from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/products", tags=["products"])

class ProductItem(BaseModel):
    id: str
    name: str
    description: str
    imageUrl: str
    link: str

# This is our placeholder data. We can replace this with a database query later.
mock_affiliate_products_data: List[ProductItem] = [
    {
        "id": "1",
        "name": "DeWalt Power Drill Kit",
        "description": "The latest brushless drill technology for maximum power and runtime. Includes two batteries.",
        "imageUrl": "https://images.unsplash.com/photo-1593432096208-54b005a74349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "link": "https://www.monter.no",
    },
    {
        "id": "2",
        "name": "Snickers Workwear Trousers",
        "description": "Durable and comfortable work trousers with holster pockets. Built for the toughest jobs.",
        "imageUrl": "https://images.unsplash.com/photo-1593432096208-54b005a74349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "link": "https://www.monter.no",
    },
    {
        "id": "3",
        "name": "Tryg Business Insurance",
        "description": "Comprehensive insurance coverage specifically tailored for independent craftsmen and small businesses.",
        "imageUrl": "https://images.unsplash.com/photo-1593432096208-54b005a74349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        "link": "https://www.monter.no",
    },
]

@router.get("/", response_model=List[ProductItem])
async def list_affiliate_products():
    """
    Lists all available affiliate products.
    This endpoint provides a list of curated products and services
    relevant to craftsmen. It's used to display partner deals
    on the craftsman's dashboard.
    """
    return mock_affiliate_products_data
