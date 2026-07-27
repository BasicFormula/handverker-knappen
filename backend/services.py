from datetime import datetime, timezone
from uuid import uuid4

from demo_data import JOBS, OFFERS


def public_document(document):
    return {key: value for key, value in document.items() if key != "_id"}


async def get_jobs(db):
    records = await db.jobs.find({}, {"_id": 0}).sort("created_index", -1).to_list(100)
    jobs = [*JOBS, *records]
    for job in jobs:
        new_offers = await db.offers.count_documents({"job_id": job["id"]})
        job["offer_count"] = job.get("offer_count", 0) + new_offers
    return jobs


async def get_job(db, job_id):
    record = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if record:
        job = record
    else:
        job = next((item.copy() for item in JOBS if item["id"] == job_id), None)
    if job:
        new_offers = await db.offers.count_documents({"job_id": job_id})
        job["offer_count"] = job.get("offer_count", 0) + new_offers
    return job


async def create_job(db, payload):
    job = {
        "id": f"job-{uuid4().hex[:8]}",
        **payload,
        "status": "Åpen",
        "created_at": "Nettopp publisert",
        "customer": "Kari Johansen",
        "verified": True,
        "offer_count": 0,
        "image": "https://images.unsplash.com/photo-1693382464372-fad822e7b38c?auto=format&fit=crop&w=800&q=85",
        "created_index": datetime.now(timezone.utc).timestamp(),
    }
    await db.jobs.insert_one(job.copy())
    return public_document(job)


async def get_offers(db, job_id):
    records = await db.offers.find({"job_id": job_id}, {"_id": 0}).to_list(100)
    return [*OFFERS.get(job_id, []), *records]


async def create_offer(db, job_id, payload):
    offer = {
        "id": f"offer-{uuid4().hex[:8]}",
        "job_id": job_id,
        **payload,
        "date": "Nettopp sendt",
    }
    await db.offers.insert_one(offer.copy())
    return public_document(offer)