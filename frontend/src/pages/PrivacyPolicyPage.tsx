import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <CardHeader>
            <CardTitle>Personvernerklæring</CardTitle>
          </CardHeader>
          <CardContent>
            <h2>1. Informasjon vi samler inn</h2>
            <p>
              Vi samler inn informasjon du gir direkte til oss, for eksempel når
              du oppretter en konto, legger ut en jobb, eller kommuniserer med oss. Dette
              kan inkludere navnet ditt, e-postadressen, telefonnummeret og posisjonen din.
            </p>

            <h2>2. Hvordan vi bruker informasjonen din</h2>
            <p>
              Vi bruker informasjonen vi samler inn til å drifte, vedlikeholde og
              tilby funksjonene og funksjonaliteten til HåndverkerKnappen-tjenesten,
              inkludert å koble håndverkere med kunder og behandle
              betalinger.
            </p>

            <h2>3. Deling av informasjon</h2>
            <p>
              Vi kan dele informasjonen din med tredjepartsleverandører og tjenesteleverandører
              som utfører tjenester på våre vegne, for eksempel betalingsbehandling
              (Stripe) og e-postlevering. Vi selger ikke dine
              personopplysninger til tredjeparter.
            </p>

            <h2>4. Datasikkerhet</h2>
            <p>
              Vi bruker kommersielt rimelige sikkerhetstiltak for å bidra til å holde
              informasjonen som samles inn gjennom tjenesten sikker. Imidlertid er ingen
              sikkerhetssystemer ugjennomtrengelige.
            </p>

            <h2>5. Dine rettigheter</h2>
            <p>
              Du har rett til å få tilgang til, oppdatere eller slette informasjonen vi
              har om deg. Du kan gjøre dette ved å gå til kontoinnstillingene dine eller
              kontakte oss direkte.
            </p>

            <h2>6. Kontakt oss</h2>
            <p>
              Hvis du har spørsmål om denne personvernerklæringen, vennligst
              kontakt oss på post@masters-as.no.
            </p>
            
            <p className="text-sm text-gray-500 mt-8">
              Sist oppdatert: 11. juli 2025.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
