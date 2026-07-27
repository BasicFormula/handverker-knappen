"""Backend API tests for Håndverkerknappen demo marketplace."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://skilled-ops.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health & basic reads ----
def test_health(client):
    r = client.get(f"{API}/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["mode"] == "demo"


def test_dashboard(client):
    r = client.get(f"{API}/dashboard")
    assert r.status_code == 200
    d = r.json()
    assert d["user"]["name"] == "Kari Johansen"
    assert "stats" in d and "open_jobs" in d["stats"]
    assert isinstance(d["recent_jobs"], list) and len(d["recent_jobs"]) > 0


def test_list_jobs(client):
    r = client.get(f"{API}/jobs")
    assert r.status_code == 200
    jobs = r.json()
    assert isinstance(jobs, list) and len(jobs) >= 3
    for j in jobs:
        assert "id" in j and "title" in j and "category" in j
        assert "_id" not in j


def test_job_detail(client):
    r = client.get(f"{API}/jobs/job-kitchen")
    assert r.status_code == 200
    d = r.json()
    assert d["job"]["id"] == "job-kitchen"
    assert isinstance(d["offers"], list)


def test_job_detail_404(client):
    r = client.get(f"{API}/jobs/does-not-exist")
    assert r.status_code == 404


def test_craftspeople(client):
    r = client.get(f"{API}/craftspeople")
    assert r.status_code == 200
    ppl = r.json()
    assert any(p["id"] == "craft-ida" for p in ppl)


def test_affiliate_products(client):
    r = client.get(f"{API}/affiliate-products")
    assert r.status_code == 200
    assert len(r.json()) >= 3


def test_payment_options(client):
    r = client.get(f"{API}/payments/options")
    assert r.status_code == 200
    d = r.json()
    assert d["mode"] == "demo"
    assert d["stripe"]["available"] is False
    assert d["vipps"]["available"] is False


def test_email_templates(client):
    r = client.get(f"{API}/email/templates")
    assert r.status_code == 200
    assert len(r.json()) >= 3


# ---- Create job + persistence ----
def test_create_job_and_persist(client):
    payload = {
        "title": "TEST_ Elektriker til smarthus",
        "category": "Elektriker",
        "location": "Grünerløkka, Oslo",
        "budget": "20 000–30 000 kr",
        "description": "Installere smart belysning og nye stikk i stue og kjøkken.",
    }
    r = client.post(f"{API}/jobs", json=payload)
    assert r.status_code == 201, r.text
    job = r.json()
    assert job["title"] == payload["title"]
    assert job["id"].startswith("job-")
    assert "_id" not in job

    # verify persisted
    r2 = client.get(f"{API}/jobs/{job['id']}")
    assert r2.status_code == 200
    assert r2.json()["job"]["title"] == payload["title"]


def test_create_job_validation(client):
    r = client.post(f"{API}/jobs", json={"title": "x", "category": "", "location": "", "budget": "", "description": "z"})
    assert r.status_code == 422


# ---- Offer flow ----
def test_post_offer(client):
    payload = {"craftsperson_id": "craft-ida", "amount": "22 000 kr",
               "message": "TEST_ Kan starte neste uke og ta befaring på fredag."}
    r = client.post(f"{API}/jobs/job-kitchen/offers", json=payload)
    assert r.status_code == 201, r.text
    d = r.json()
    assert d["craftsperson_id"] == "craft-ida"
    assert d["job_id"] == "job-kitchen"
    assert "_id" not in d


def test_post_offer_missing_job(client):
    r = client.post(f"{API}/jobs/nope/offers", json={
        "craftsperson_id": "craft-ida", "amount": "10 kr", "message": "TEST_ ikke gyldig"
    })
    assert r.status_code == 404


# ---- Assignment ----
def test_assignment_vipps(client):
    r = client.post(f"{API}/jobs/job-kitchen/assignment",
                    json={"craftsperson_id": "craft-ida", "payment_method": "vipps"})
    assert r.status_code == 200
    d = r.json()
    assert d["assignment"]["payment_method"] == "vipps"
    assert d["assignment"]["status"] == "demo_pending_payment"
    assert "_id" not in d["assignment"]


def test_assignment_stripe(client):
    r = client.post(f"{API}/jobs/job-kitchen/assignment",
                    json={"craftsperson_id": "craft-ida", "payment_method": "stripe"})
    assert r.status_code == 200
    assert r.json()["assignment"]["payment_method"] == "stripe"


def test_assignment_invalid_payment(client):
    r = client.post(f"{API}/jobs/job-kitchen/assignment",
                    json={"craftsperson_id": "craft-ida", "payment_method": "paypal"})
    assert r.status_code == 422


def test_assignment_unknown_craft(client):
    r = client.post(f"{API}/jobs/job-kitchen/assignment",
                    json={"craftsperson_id": "craft-unknown", "payment_method": "vipps"})
    assert r.status_code == 404


# ---- Ratings ----
def test_create_rating(client):
    r = client.post(f"{API}/ratings",
                    json={"craftsperson_id": "craft-ida", "score": 5, "comment": "TEST_ Flott jobb"})
    assert r.status_code == 201
    assert r.json()["score"] == 5
