from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from app.auth import AuthorizedUser
from app.libs.database import get_db_connection, release_db_connection
from app.libs.email_sender import send_email
from app.libs.launch_campaign import run_launch_campaign
from openai import OpenAI
import os

router = APIRouter()

def send_email_background(email: str, subject: str, content: str):
    try:
        # Convert newlines to <br> if content is plain text (simple heuristic)
        if "<br>" not in content and "<p>" not in content:
            content = content.replace("\n", "<br>")

        # Wrap in HTML template
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    {content}
                    <br><br>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="text-align: center;">
                        <a href="https://mastersas.riff.works/craftsman-dashboard" style="display: inline-block; background-color: #e34b30; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Gå til min side</a>
                    </p>
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        Hilsen HåndverkerKnappen-teamet
                    </p>
                </div>
            </body>
        </html>
        """
        
        send_email(to_email=email, subject=subject, html_content=html_content)
        print(f"Successfully sent email to {email}")
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")

class EmailTarget(BaseModel):
    user_ids: Optional[List[str]] = None

@router.post("/send-monthly-emails", tags=["Engagement"])
async def send_monthly_emails(background_tasks: BackgroundTasks, user: AuthorizedUser, target: EmailTarget | None = None):
    """
    This endpoint triggers the process of sending AI-generated
    monthly emails to craftsmen.
    If target.user_ids is provided, only sends to those users.
    Otherwise sends to all.
    """
    conn = await get_db_connection()
    try:
        if target and target.user_ids:
            craftsmen = await conn.fetch("SELECT user_id, business_name, email FROM craftsmen_profiles WHERE user_id = ANY($1)", target.user_ids)
        else:
            craftsmen = await conn.fetch("SELECT user_id, business_name, email FROM craftsmen_profiles")
    finally:
        await release_db_connection(conn)

    if not craftsmen:
        return {"status": "success", "message": "No craftsmen found to send emails to."}

    try:
        openai_api_key = os.environ.get("OPENAI_API_KEY")
        if not openai_api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not found.")
        client = OpenAI(api_key=openai_api_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get OpenAI API key: {e}")

    for craftsman in craftsmen:
        prompt = (
            f"Generate a kind and humble monthly email for a craftsman named {craftsman['business_name']}. "
            "The email should be warm, appreciative, and encouraging. "
            "It should make them feel like a valued part of the HåndverkerKnappen community. "
            "The tone should be personal and not corporate. "
            "Keep it short and to the point."
        )
        
        try:
            completion = client.chat.completions.create(
                model="gpt-5-nano",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that writes encouraging emails."},
                    {"role": "user", "content": prompt}
                ]
            )
            email_content = completion.choices[0].message.content
        except Exception as e:
            print(f"Failed to generate email for {craftsman['business_name']}: {e}")
            continue

        subject = "En hyggelig hilsen fra HåndverkerKnappen"
        
        # In a real implementation, you would trigger a background task
        # to handle the email sending process.
        background_tasks.add_task(send_email_background, craftsman['email'], subject, email_content)

    return {"status": "success", "message": f"Initiated sending emails to {len(craftsmen)} craftsmen."}

@router.post("/send-launch-emails", tags=["Engagement"])
async def send_launch_emails(background_tasks: BackgroundTasks, user: AuthorizedUser, target: EmailTarget | None = None):
    """
    Triggers the '50 kr' launch campaign email.
    """
    conn = await get_db_connection()
    try:
        if target and target.user_ids:
            craftsmen = await conn.fetch("SELECT user_id, name, business_name, email FROM craftsmen_profiles WHERE user_id = ANY($1)", target.user_ids)
        else:
            craftsmen = await conn.fetch("SELECT user_id, name, business_name, email FROM craftsmen_profiles")
    finally:
        await release_db_connection(conn)

    if not craftsmen:
        print("No craftsmen found for launch campaign.")
        return {"status": "success", "message": "No craftsmen found."}

    print(f"Found {len(craftsmen)} craftsmen for launch campaign.")

    # Prepare recipients list for the bulk sender
    recipients = []
    for c in craftsmen:
        # Use first name if available, else business name, else "Håndverker"
        name = c['name'] or c['business_name'] or "Håndverker"
        if " " in name:
            name = name.split(" ")[0] # Just first name
            
        recipients.append({
            "email": c['email'],
            "name": name
        })

    # The link to include in the email
    # Using the standard path-based URL to ensure it matches the APP_BASE_PATH (/mastersas)
    signup_link = "https://riff.works/mastersas/craftsman-dashboard"

    # run_launch_campaign is a sync function that calls send_bulk_emails (which might be sync). 
    # For now, we'll run it in background task to not block.
    # Note: run_launch_campaign does print statements, so we might want to wrap it or just call it.
    # Since it might take time, background task is best.
    
    def _run_campaign_task():
        run_launch_campaign(recipients, signup_link)

    background_tasks.add_task(_run_campaign_task)

    return {"status": "success", "message": f"Launch campaign started for {len(recipients)} recipients."}
