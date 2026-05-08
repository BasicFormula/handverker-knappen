from app.libs.email_sender import send_bulk_emails
from typing import List, Dict

EMAIL_SUBJECT = "Invitasjon: Ny håndverker-app lanseres i Oslo"

EMAIL_BODY = """
Hei {{Fornavn}},

Vi lanserer snart HåndverkerKnappen i Oslo – en ny tjeneste som kobler seriøse håndverkere direkte med kunder, uten anbudskrig.

Alle håndverkere verifiseres med BankID for å sikre trygghet og kvalitet.

Før vi åpner for kunder, gir vi utvalgte håndverkere i Oslo-området muligheten til å sikre seg en plass.

Registrerer du deg nå, får du:
- 50% rabatt på alle kundekontakter det første året
- Kun 50 kr eks. mva per oppdrag frem til 1. januar 2027
- Ingen bindingstid eller skjulte gebyrer
- Gratis bedriftsprofil og synlighet
- Ingen provisjon av oppdragssummen

En enkelt jobb vil dermed dekke kostnadene mange ganger.

Det er helt uforpliktende å registrere seg – du betaler kun når du velger å ta en jobb.

Sikre din plass og din pris her:
{{din-link}}

Med vennlig hilsen,
HåndverkerKnappen-teamet
"""

def run_launch_campaign(recipients: List[Dict[str, str]], signup_link: str):
    """
    Runs the launch campaign email blast.
    recipients: List of dicts with 'email' and 'name'.
    signup_link: The link to the registration page.
    """
    print(f"Starting launch campaign for {len(recipients)} recipients...")
    
    results = send_bulk_emails(
        recipients=recipients,
        subject_template=EMAIL_SUBJECT,
        body_template=EMAIL_BODY,
        link_url=signup_link
    )
    
    print("Campaign finished.")
    print(f"Success: {results['success']}")
    print(f"Failed: {results['failed']}")
    return results
