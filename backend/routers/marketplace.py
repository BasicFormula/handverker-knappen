from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from demo_data import AFFILIATE_PRODUCTS, CRAFTSPEOPLE
from database import db
from schemas import AssignmentCreate, JobCreate, OfferCreate, RatingCreate
from services import create_job, create_offer, get_job, get_jobs, get_offers


router = APIRouter(tags=["marketplace"])


@router.get("/health")
async def health_check():
    return {"status": "ok", "mode": "demo", "integrations": "waiting_for_credentials"}


@router.get("/dashboard")
async def dashboard():
    jobs = await get_jobs(db)
    completed_ratings = await db.ratings.count_documents({})
    return {
        "user": {"name": "Kari Johansen", "role": "Kunde", "verified": True},
        "stats": {
            "open_jobs": len([job for job in jobs if job["status"] == "Åpen"]),
            "received_offers": sum(job["offer_count"] for job in jobs),
            "completed": completed_ratings,
        },
        "recent_jobs": jobs[:3],
    }


@router.get("/jobs")
async def list_jobs():
    return await get_jobs(db)


@router.post("/jobs", status_code=201)
async def post_job(payload: JobCreate):
    return await create_job(db, payload.model_dump())


@router.get("/jobs/{job_id}")
async def job_detail(job_id: str):
    job = await get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Oppdraget finnes ikke")
    return {"job": job, "offers": await get_offers(db, job_id)}


@router.post("/jobs/{job_id}/offers", status_code=201)
async def post_offer(job_id: str, payload: OfferCreate):
    if not await get_job(db, job_id):
        raise HTTPException(status_code=404, detail="Oppdraget finnes ikke")
    return await create_offer(db, job_id, payload.model_dump())


@router.post("/jobs/{job_id}/assignment")
async def assign_craftsperson(job_id: str, payload: AssignmentCreate):
    if not await get_job(db, job_id):
        raise HTTPException(status_code=404, detail="Oppdraget finnes ikke")
    craftsperson = next((person for person in CRAFTSPEOPLE if person["id"] == payload.craftsperson_id), None)
    if not craftsperson:
        raise HTTPException(status_code=404, detail="Håndverkeren finnes ikke")
    assignment = {
        "job_id": job_id,
        "craftsperson": craftsperson,
        "fee": 50,
        "payment_method": payload.payment_method,
        "status": "demo_pending_payment",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.assignments.insert_one(assignment.copy())
    return {"assignment": {key: value for key, value in assignment.items() if key != "_id"}, "message": "Håndverker valgt. Betalingssteget er klart for aktivering."}


@router.post("/ratings", status_code=201)
async def create_rating(payload: RatingCreate):
    rating = {"id": f"rating-{payload.craftsperson_id}", **payload.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.ratings.insert_one(rating.copy())
    return rating


@router.get("/craftspeople")
async def list_craftspeople():
    return CRAFTSPEOPLE


@router.get("/affiliate-products")
async def list_affiliate_products():
    return AFFILIATE_PRODUCTS


@router.get("/payments/options")
async def payment_options():
    return {"stripe": {"available": False, "label": "Kort med Stripe"}, "vipps": {"available": False, "label": "Vipps"}, "fee": 50, "mode": "demo"}


@router.get("/email/templates")
async def email_templates():
    return [
        {"id": "welcome", "title": "Velkommen", "trigger": "Ny verifisert bruker"},
        {"id": "new-job", "title": "Nytt oppdrag", "trigger": "Relevant oppdrag publisert"},
        {"id": "receipt", "title": "Betalingskvittering", "trigger": "Oppdrag tildelt"},
        {"id": "rating", "title": "Ratingpåminnelse", "trigger": "Oppdrag markert fullført"},
        {"id": "intro-offer", "title": "Halv pris første år", "trigger": "Planlagt kampanje"},
    ]