# This API handles all notification-related functionalities.

from fastapi import APIRouter
from app.libs.models import AssignmentDetails

router = APIRouter()

@router.post("/new-job-alert")
async def send_new_job_alert(assignment: AssignmentDetails):
    """
    This endpoint is triggered when a new service request is created.
    It finds matching craftsmen and sends them an email notification.
    """
    # This function is now a placeholder and the logic has been moved to a library
    # to avoid circular dependencies. The actual sending of emails is handled
    # directly in the create_assignment endpoint.
    return {"message": "This endpoint is deprecated. Email notifications are sent directly."}
