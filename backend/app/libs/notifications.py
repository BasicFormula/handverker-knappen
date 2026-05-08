import asyncpg
from app.libs.database import get_db_connection, release_db_connection
from app.libs.models import AssignmentDetails

async def send_monthly_emails(assignment: AssignmentDetails):
    """
    Finds matching craftsmen for a new assignment and sends them an email notification.
    """
    conn = None
    try:
        conn = await get_db_connection()
        
        # Find craftsmen who match any of the required services and the location
        query = """
            SELECT user_id, email, name FROM craftsmen_profiles
            WHERE services && $1 AND $2 = ANY(areas);
        """
        
        matched_craftsmen = await conn.fetch(query, assignment.required_services, assignment.location)

        if not matched_craftsmen:
            print("No matching craftsmen found for notification.")
            return

        for craftsman in matched_craftsmen:
            # Placeholder for email sending
            print(f"Would send email to {craftsman['email']} about new assignment {assignment.id}")
            # db.notify.email(
            #     to=craftsman['email'],
            #     subject=f"Ny jobb tilgjengelig: {assignment.headline}",
            #     content_text=f"Hei {craftsman['name'] or 'Håndverker'},\n\nEn ny jobb som matcher dine tjenester er tilgjengelig i {assignment.location}.\n\nBeskrivelse: {assignment.detailed_description}\n\nLogg inn for å se detaljer."
            # )
            
    except Exception as e:
        print(f"Error sending job alerts: {e}")
    finally:
        if conn:
            await release_db_connection(conn)
