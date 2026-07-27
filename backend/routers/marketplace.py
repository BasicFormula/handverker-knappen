from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from demo_data import AFFILIATE_PRODUCTS, CRAFTSPEOPLE
from database import db
from schemas import (
    AssignmentCreate,
    CraftspersonOnboard,
    JobCreate,
    OfferCreate,
    RatingCreate,
    ReliabilityEvent,
)
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
        craftsperson = await db.craftspeople.find_one({"id": payload.craftsperson_id}, {"_id": 0})
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
    profile = await db.craftspeople.find_one({"id": payload.craftsperson_id}, {"_id": 0})
    if profile:
        previous_count = profile.get("review_count", 0)
        previous_rating = profile.get("rating", 0) or 0
        new_count = previous_count + 1
        new_rating = round(((previous_rating * previous_count) + payload.score) / new_count, 1)
        await db.craftspeople.update_one(
            {"id": payload.craftsperson_id},
            {"$set": {"rating": new_rating, "review_count": new_count, "reputation_status": "rated"}},
        )
    return rating


@router.get("/craftspeople")
async def list_craftspeople():
    records = await db.craftspeople.find({}, {"_id": 0}).to_list(100)
    profiles_by_id = {person["id"]: person for person in CRAFTSPEOPLE}
    profiles_by_id.update({person["id"]: person for person in records})
    return list(profiles_by_id.values())


@router.get("/market-coverage")
async def market_coverage():
    return {
        "launch_region": "Oslo",
        "areas": ["Oslo", "Bærum", "Lillestrøm", "Nordre Follo"],
        "expansion": "Nasjonal dekning bygges område for område.",
    }


@router.post("/craftspeople/onboard", status_code=201)
async def onboard_craftsperson(payload: CraftspersonOnboard):
    supported_areas = {"Oslo", "Bærum", "Lillestrøm", "Nordre Follo"}
    if not set(payload.service_areas).issubset(supported_areas):
        raise HTTPException(status_code=422, detail="Velg områder fra Oslo-lanseringen")
    initials = "".join(part[0] for part in payload.name.split()[:2]).upper()
    craftsperson = {
        "id": f"craft-{uuid4().hex[:8]}",
        **payload.model_dump(),
        "avatar": initials,
        "rating": None,
        "review_count": 0,
        "reputation_status": "new",
        "reliability_score": 100,
        "reliability_label": "Starter",
        "verified": False,
        "verification_status": "awaiting_bankid",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.craftspeople.insert_one(craftsperson.copy())
    return {key: value for key, value in craftsperson.items() if key != "_id"}


@router.post("/craftspeople/{craftsperson_id}/reliability")
async def register_reliability_event(craftsperson_id: str, payload: ReliabilityEvent):
    changes = {"completed": 1, "cancelled": -10, "no_response": -7}
    profile = await db.craftspeople.find_one({"id": craftsperson_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Håndverkeren finnes ikke")
    score = max(0, min(100, profile.get("reliability_score", 100) + changes[payload.outcome]))
    label = "God" if score >= 90 else "Følger opp" if score >= 70 else "Trenger oppfølging"
    await db.craftspeople.update_one(
        {"id": craftsperson_id},
        {"$set": {"reliability_score": score, "reliability_label": label}},
    )
    return {"craftsperson_id": craftsperson_id, "reliability_score": score, "reliability_label": label}


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


@router.get("/launch-campaign")
async def launch_campaign():
    return {
        "campaign": {
            "name": "Oslo – håndverkerinvitasjon",
            "status": "consent_required",
            "launch_timing": "14 dager før kundelansering",
            "sender_status": "Resend ikke tilkoblet",
            "contacts_imported": 0,
        },
        "segments": [
            {"id": "electrician-oslo", "label": "Elektrikere i Oslo", "trade": "Elektriker", "area": "Oslo"},
            {"id": "plumber-oslo", "label": "Rørleggere i Oslo", "trade": "Rørlegger", "area": "Oslo"},
            {"id": "carpenter-oslo", "label": "Tømrere i Oslo", "trade": "Tømrer", "area": "Oslo"},
            {"id": "greater-oslo", "label": "Utvidet Oslo-område", "trade": "Alle fag", "area": "Bærum, Lillestrøm og Nordre Follo"},
        ],
        "required_fields": ["Navn", "Bedrift", "E-post", "Fagområde", "Område", "Samtykkedato", "Samtykkekilde"],
        "templates": [
            {
                "id": "launch-invite",
                "title": "Invitasjon til fagprofil",
                "subject": "Bygg tillit fra første oppdrag i Oslo",
                "preview": "Håndverkerknappen åpner snart for kunder i Oslo. Opprett fagprofil før lansering.",
            },
            {
                "id": "launch-reminder",
                "title": "Påminnelse før kundelansering",
                "subject": "En uke igjen: Vær synlig når Oslo-kundene kommer",
                "preview": "Fullfør fagprofilen og BankID-verifiseringen før kundene kan legge ut oppdrag.",
            },
            {
                "id": "launch-day",
                "title": "Kundelansering",
                "subject": "Håndverkerknappen er nå åpen for Oslo",
                "preview": "Se oppdrag som matcher faget og områdene du har valgt.",
            },
        ],
    }