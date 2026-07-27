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


# ---- Market coverage ----
def test_market_coverage(client):
    r = client.get(f"{API}/market-coverage")
    assert r.status_code == 200
    d = r.json()
    assert d["launch_region"] == "Oslo"
    assert "Oslo" in d["areas"]
    assert len(d["areas"]) >= 3
    assert "expansion" in d


# ---- Craftsperson onboarding + reliability ----
@pytest.fixture(scope="module")
def onboarded(client):
    payload = {
        "name": "TEST_ Ola Nordmann",
        "company": "TEST_ Nordmann Elektro AS",
        "trade": "Elektriker",
        "location": "Oslo",
        "service_areas": ["Oslo", "Bærum"],
        "bio": "TEST_ Erfaren elektriker med sertifisering og fokus på smarthus.",
    }
    r = client.post(f"{API}/craftspeople/onboard", json=payload)
    assert r.status_code == 201, r.text
    return r.json()


def test_onboard_returns_no_rating(onboarded):
    p = onboarded
    assert p["rating"] is None
    assert p["review_count"] == 0
    assert p["reputation_status"] == "new"
    assert p["reliability_score"] == 100
    assert p["verification_status"] == "awaiting_bankid"
    assert p["verified"] is False
    assert "_id" not in p
    assert p["id"].startswith("craft-")
    assert p["service_areas"] == ["Oslo", "Bærum"]


def test_onboard_validation(client):
    r = client.post(f"{API}/craftspeople/onboard", json={
        "name": "X", "company": "Y", "trade": "E", "location": "O",
        "service_areas": [], "bio": "too short",
    })
    assert r.status_code == 422


def test_new_craftsperson_in_list(client, onboarded):
    r = client.get(f"{API}/craftspeople")
    assert r.status_code == 200
    ppl = r.json()
    match = next((p for p in ppl if p["id"] == onboarded["id"]), None)
    assert match is not None
    assert match["rating"] is None
    assert match["review_count"] == 0


def test_reliability_cancelled_reduces_score(client, onboarded):
    cid = onboarded["id"]
    r = client.post(f"{API}/craftspeople/{cid}/reliability", json={"outcome": "cancelled"})
    assert r.status_code == 200
    d = r.json()
    assert d["reliability_score"] == 90
    assert d["reliability_label"] in ("God", "Følger opp", "Trenger oppfølging")


def test_reliability_independent_of_rating(client, onboarded):
    cid = onboarded["id"]
    # rating still empty even after reliability event
    r = client.get(f"{API}/craftspeople")
    match = next((p for p in r.json() if p["id"] == cid), None)
    assert match["rating"] is None
    assert match["review_count"] == 0


def test_reliability_unknown_craft_404(client):
    r = client.post(f"{API}/craftspeople/craft-does-not-exist/reliability",
                    json={"outcome": "cancelled"})
    assert r.status_code == 404


def test_reliability_invalid_outcome(client, onboarded):
    r = client.post(f"{API}/craftspeople/{onboarded['id']}/reliability",
                    json={"outcome": "nope"})
    assert r.status_code == 422


# ---- Cleanup ----
def test_cleanup(client, onboarded):
    """Best-effort cleanup of TEST_ data via direct Mongo is not possible from here;
    onboarded records remain in db.craftspeople. This test simply reports.
    """
    assert onboarded["id"].startswith("craft-")
