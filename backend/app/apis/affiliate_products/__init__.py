from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Pydantic model for an affiliate product
class AffiliateProduct(BaseModel):
    id: int
    name: str
    description: str
    image_url: str
    product_url: str
    partner_name: str

# Hardcoded list of example products
# We'll use realistic examples from well-known suppliers
EXAMPLE_PRODUCTS: List[AffiliateProduct] = [
    AffiliateProduct(
        id=1,
        name="Milwaukee M18 FPD2-502X Fuel Slagdrill",
        description="Kraftig og kompakt slagdrill for de tøffeste oppgavene. FUEL™-teknologi gir overlegen ytelse og holdbarhet.",
        image_url="https://www.motek.no/globalassets/product-images/milwaukee/4933464264.jpg",
        product_url="https://www.motek.no/maskiner-og-verktoy/batteridrevne-maskiner/slagdrill/milwaukee-m18-fpd2-502x-fuel-slagdrill/4933464264",
        partner_name="Motek"
    ),
    AffiliateProduct(
        id=2,
        name="Würth Zebra T-håndtak Skrutrekkersett",
        description="Ergonomisk T-håndtak skrutrekkersett med 6 deler. Sikrer optimal kraftoverføring og komfort under arbeid.",
        image_url="https://eshop.wuerth.no/Produktbilder/normal/06139406.jpg",
        product_url="https://eshop.wuerth.no/Verktoey/Haandverktoey/Skrutrekkere/Skrutrekkere-sett/SKRUTREKKERSETT-ZEBRA-T-HAoNDTAK-6-DL/06139406.p",
        partner_name="Würth"
    ),
     AffiliateProduct(
        id=3,
        name="Hultafors Håndøks H 008 SV",
        description="Klassisk håndøks for tømrerarbeid og friluftsliv. Smidd for hånd og laget av svensk øksestål for maksimal skarphet.",
        image_url="https://www.hultafors.no/globalassets/hultafors/products/840025_h008sv.png?w=1280&h=1280&mode=max",
        product_url="https://www.hultafors.no/produkter/hogging/okser/840025-hultafors-h008-sv-haandoks",
        partner_name="Hultafors"
    ),
    AffiliateProduct(
        id=4,
        name="DeWalt DCD791P2 18V XR Børsteløs Drill",
        description="Kompakt og lett design for arbeid på trange steder. 2-girs girkasse i metall for økt kjøretid og levetid.",
        image_url="https://staypro.no/wp-content/uploads/2021/01/DeWalt-DCD791P2.jpg", 
        product_url="https://staypro.no/maskiner-og-verktoy/batteridrevne-maskiner/bormaskin-og-skrutrekker/dewalt-dcd791p2-18v-xr-borstelos-drill/",
        partner_name="Staypro"
    ),
]

@router.get("/affiliate-products", response_model=List[AffiliateProduct])
def list_affiliate_products2():
    """
    Returns a hardcoded list of affiliate products.
    This serves as a placeholder until a dynamic system is implemented.
    """
    return EXAMPLE_PRODUCTS
