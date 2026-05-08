import os
import resend
import time
from typing import List, Dict, Optional

# Set the API key globally for the library
resend.api_key = os.environ.get("RESEND_API_KEY")

def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    from_email: Optional[str] = None
) -> Dict:
    """
    Sends a single email using Resend.
    """
    if not from_email:
        from_email = os.environ.get("SENDER_EMAIL")
        
    if not from_email:
        raise ValueError("SENDER_EMAIL environment variable not set and no from_email provided.")

    params = {
        "from": from_email,
        "to": [to_email],
        "subject": subject,
        "html": html_content,
    }

    try:
        response = resend.Emails.send(params)
        return response
    except Exception as e:
        print(f"Error sending email to {to_email}: {e}")
        raise e

def send_bulk_emails(
    recipients: List[Dict[str, str]], 
    subject_template: str, 
    body_template: str,
    link_url: str
) -> Dict[str, int]:
    """
    Sends bulk emails to a list of recipients.
    recipients: List of dicts, e.g. [{'email': '...', 'name': '...'}]
    subject_template: String with placeholders like {{Fornavn}}
    body_template: String with placeholders like {{Fornavn}} and {{din-link}}
    link_url: The URL to replace {{din-link}} with.
    """
    
    success_count = 0
    fail_count = 0
    
    for recipient in recipients:
        email = recipient.get('email')
        name = recipient.get('name', 'Håndverker') # Default fallback
        
        if not email:
            print(f"Skipping recipient without email: {recipient}")
            continue
            
        # Personalize content
        # We handle case-insensitive replacements or specific keys provided by user
        personalized_subject = subject_template.replace("{{Fornavn}}", name)
        personalized_body = body_template.replace("{{Fornavn}}", name).replace("{{din-link}}", link_url)
        
        # Simple HTML wrapper for better presentation
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    {personalized_body.replace(link_url, f'<a href="{link_url}" style="color: #e34b30; font-weight: bold;">Klikk her for å registrere deg</a>')}
                    <br><br>
                    <p style="font-size: 12px; color: #888;">
                        Har du spørsmål? Svar direkte på denne e-posten.
                    </p>
                </div>
            </body>
        </html>
        """
        
        # Replace newlines with <br> for the text content part if it's plain text input
        # But we assume the template might be partial HTML or plain text. 
        # A safer approach for plain text input is to replace \n with <br>
        html_body = html_body.replace("\n", "<br>")

        try:
            send_email(to_email=email, subject=personalized_subject, html_content=html_body)
            print(f"Sent email to {email}")
            success_count += 1
            time.sleep(1.1) # Prevent hitting Resend rate limits (2 req/sec)
        except Exception as e:
            print(f"Failed to send to {email}: {e}")
            fail_count += 1
            time.sleep(1.1) # Sleep even on failure to respect rate limits
            
    return {"success": success_count, "failed": fail_count}
