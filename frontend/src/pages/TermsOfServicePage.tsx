import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <CardHeader>
            <CardTitle>Vilkår for bruk</CardTitle>
          </CardHeader>
          <CardContent>
            <h2>1. Introduksjon</h2>
            <p>
              Velkommen til HåndverkerKnappen ("Selskapet", "vi", "vårs", "oss"). Disse vilkårene for
              bruk ("Vilkårene") regulerer din bruk av vår nettside og tjenestene
              som tilbys gjennom den. Ved å få tilgang til eller bruke tjenesten vår, samtykker du
              i å være bundet av disse vilkårene.
            </p>

            <h2>2. Tjenester</h2>
            <p>
              HåndverkerKnappen tilbyr en plattform for å koble håndverkere med kunder
              som søker tjenester. Vi legger til rette for den innledende kontakten, men er ikke en
              part i noen avtale mellom håndverkeren og kunden.
            </p>

            <h2>3. Brukerforpliktelser</h2>
            <p>
              Som bruker samtykker du i å gi nøyaktig og fullstendig
              informasjon. Håndverkere er ansvarlige for sine egne lisenser,
              forsikringer og juridisk etterlevelse. Kunder er ansvarlige for
              å undersøke håndverkere og ta sine egne ansettelsesbeslutninger.
            </p>

            <h2>4. Betalinger</h2>
            <p>
              Håndverkere samtykker i å betale et gebyr for leads som beskrevet på
              plattformen. Alle betalinger behandles gjennom en tredjeparts betalingsleverandør
              (f.eks. Stripe). Vi er ikke ansvarlige for eventuelle problemer
              som oppstår fra betalingsprosessen.
            </p>

            <h2>5. Ansvarsbegrensning</h2>
            <p>
              Vår plattform leveres "som den er". Vi er ikke ansvarlige for eventuelle
              skader eller tap knyttet til din bruk av tjenesten, inkludert men
              ikke begrenset til tvister mellom brukere, kvaliteten på arbeidet
              utført, eller eventuelle økonomiske tap.
            </p>

            <h2>6. Lovvalg</h2>
            <p>
              Disse vilkårene skal reguleres av og tolkes i samsvar med
              Norges lover, uten hensyn til lovkonfliktregler.
            </p>

            <h2>7. Kontaktinformasjon</h2>
            <p>
              For spørsmål om disse vilkårene, vennligst kontakt oss på post@masters-as.no.
            </p>
            
            <p className="text-sm text-gray-500 mt-8">
              Sist oppdatert: 11. juli 2025. Vennligst gjennomgå disse vilkårene jevnlig for endringer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
