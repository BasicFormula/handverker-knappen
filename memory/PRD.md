## Håndverkerknappen – Produktnotat

### Opprinnelig bestilling
Bygg en trygg, norskspråklig markedsplass der BankID-verifiserte kunder kan legge ut oppdrag og verifiserte håndverkere kan gi tilbud. Plattformen skal vise Stripe- og Vipps-valg ved tildeling, automatiserte e-postløp og relevant affiliate-innhold. Brukeren ønsket en komplett demo-versjon med realistisk norsk innhold, men uten tilgjengelige tredjepartstilganger eller reelle trekk.

### Arkitekturvalg
- React-basert frontend med mobiltilpassede sider og FastAPI-backend.
- MongoDB brukes i dette miljøet for demo-persistens; den planlagte MariaDB-migreringen kan utføres når Uniweb-tilgang foreligger.
- Integrasjoner er designet som demoklare grensesnitt: BankID/Criipto/Clerk, Stripe, Vipps og Resend er ikke aktivert uten nøkler.
- Standard FastAPI-router brukes for markedsplassfunksjoner. Datatilgang er skilt ut i `backend/database.py` for å unngå sirkulære avhengigheter.

### Brukerpersoner
- Kunde: Verifisert privatperson som oppretter oppdrag, vurderer tilbud og velger håndverker.
- Håndverker: Fagperson som finner relevante oppdrag, sender tilbud og belastes per vunnet oppdrag når betaling aktiveres.

### Kjernekrav
- Norsk, tillitsskapende og mobilvennlig grensesnitt.
- BankID-status skal være synlig på kunder og håndverkere.
- Oppdrag, tilbud, valg av håndverker og vurderinger må ha API-støtte.
- Stripe og Vipps vises side om side ved tildeling uten å gjennomføre trekk i demo.
- E-postmaler og affiliateprodukter vises kontekstuelt.

### Implementert – 2026-07-27
- Dashboard med oppdragsoversikt, BankID-status, statistikk og e-postautomatisering.
- Oppdragstorg med søk, fagfilter, realistiske demooppdrag og detaljerte oppdragssider.
- Skjema for nytt oppdrag med lagring i databasen; demo-oppdrag beholdes etter nye publiseringer.
- Tilbudsinnsending, håndverkerkort med rating og BankID-badge, samt tildelingsflyt med Vipps/Stripe i demomodus.
- Profilside for identitet, betalingsklargjøring, varsler og fem e-postløp.
- API-er for helse, oppdrag, tilbud, tildeling, ratings, håndverkere, affiliateprodukter, betalingsvalg og e-postmaler.
- Kontroller: API- og grensesnitttester bestått, inkludert mobilvisning uten horisontal overflyt.

### Funksjon lagt til – 2026-07-27
- Håndverker-onboarding med fagområde, virksomhetsprofil og valgbare lanseringsområder: Oslo, Bærum, Lillestrøm og Nordre Follo.
- Ærlig omdømmemodell V1: nye håndverkere får statusen «Ny på plattformen» uten kunstig stjernescore; kundestjerner kommer først etter en reell vurdering.
- Separat pålitelighetssignal for gjennomføring, avlysninger og manglende respons, uavhengig av kundestjerner.
- Kundesider forklarer hvordan BankID, opptjente stjerner og pålitelighet skal tolkes.
- Mobilnavigasjon gjør kunde-, oppdrags-, profil- og fagfolksidene tilgjengelige på små skjermer.

### Funksjon lagt til – 2026-07-27: samtykkesikker Oslo-lansering
- Lanseringssenter for Oslo med fire planlagte håndverkersegmenter og en 14-dagers invitasjonsperiode før kundelansering.
- Tre norske e-postutkast for invitasjon, påminnelse og lanseringsdag.
- Samtykkelås: ingen kontaktimport, opplasting eller utsendelse er tilgjengelig før grunnlaget kan dokumenteres.
- Importkrav er synlige: navn, bedrift, e-post, fagområde, område, samtykkedato og samtykkekilde.
- Påmeldingslenke til fagprofil kan kopieres fra lanseringssenteret.

### Prioritert backlog
#### P0
- Koble til Clerk + Criipto OIDC med reell BankID-verifisering når tilganger foreligger.
- Migrere data og modeller fra demo-MongoDB til Uniweb MariaDB.
- Implementere signaturverifiserte Stripe/Vipps-webhooks og reell betalingsautomasjon.

#### P1
- Resend-avsender, transaksjons-e-post og planlagte kampanjer.
- Håndverker-onboarding med betalingsmetode og fag-/geografipreferanser.
- Aktivere import og Resend-utsendelse først når samtykkegrunnlag, avsenderdomene og nødvendig tilgang er på plass.
- Bildelasting til oppdrag med objektlagring.

#### P2
- Akutt krisehjelp, foretrukket håndverker, smart matching og stemmeassistent.
- Produksjonsklar klikksporing og partneradministrasjon for affiliateprodukter.

### Neste oppgaver
1. Motta integrasjonstilganger og konfigurere dem som miljøvariabler.
2. Etablere MariaDB-skjema og flytte dataaksesslaget.
3. Aktivere reell betalings- og e-postflyt med ende-til-ende-logg og feilhåndtering.
