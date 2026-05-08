import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import brain from "brain";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NordicInput } from "components/NordicInput";
import { NordicTextarea } from "components/NordicTextarea";
import { NordicSelect } from "components/NordicSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@stackframe/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SERVICE_CATEGORIES } from "utils/services";
import { useEffect } from "react";
import { APP_BASE_PATH } from "app";

const formSchema = z.object({
  service_category: z.string().min(1, "Du må velge en tjeneste."),
  job_description: z
    .string()
    .min(10, "Beskrivelsen må være minst 10 tegn.")
    .max(500, "Beskrivelsen kan ikke være mer enn 500 tegn."),
  location: z.string().min(2, "Sted/adresse er påkrevd."),
  preferred_time: z.string().optional(),
});

type ServiceRequestFormValues = z.infer<typeof formSchema>;

export default function ServiceRequestPage() {
  const navigate = useNavigate();
  const user = useUser(); // Can be null if not logged in
  const [searchParams] = useSearchParams();
  
  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = `${APP_BASE_PATH}/auth/sign-in`;
    }
  }, [user]);

  const categoryParam = searchParams.get("category");
  const urgentParam = searchParams.get("urgent");

  // Find the category value based on the label passed in query param (if it matches label)
  // or use it directly if it matches a value
  const preSelectedCategory = SERVICE_CATEGORIES.find(c => c.label === categoryParam || c.value === categoryParam)?.value || "";
  
  const defaultDescription = urgentParam === "true" ? "AKUTT: Jeg trenger hjelp så fort som mulig. " : "";

  const form = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_category: preSelectedCategory,
      job_description: defaultDescription,
      location: "",
      preferred_time: urgentParam === "true" ? "Så snart som mulig" : "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: ServiceRequestFormValues) => {
    if (!user) return; // Safety check
    
    const toastId = toast.loading("Sender din forespørsel...");

    try {
      // Include user info in the submission
      const submissionData = {
        ...values,
        customer_name: user.displayName || "N/A",
        customer_email: user.primaryEmail || "N/A",
        customer_phone: user.clientMetadata?.phoneNumber || "",
      };

      const response = await brain.create_assignment(submissionData);

      if (response.ok) {
        toast.success("Forespørsel sendt!", {
          id: toastId,
          description: "Vi varsler håndverkere og tar kontakt med deg snart.",
        });
        navigate("/my-assignments-page");
      } else {
        const errorData = await response.json();
        toast.error("Sending feilet.", {
          id: toastId,
          description:
            errorData.detail || "Vennligst sjekk detaljene og prøv igjen.",
        });
      }
    } catch (error) {
      console.error("Feil ved sending av serviceforespørsel:", error);
      toast.error("En uventet feil oppstod.", {
        id: toastId,
        description:
          "Kunne ikke koble til serveren. Vennligst prøv igjen senere.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="type-headline-xl text-forest-900 mb-3">Legg ut Oppdrag</h1>
          <p className="text-slate-600/70 text-lg font-sans max-w-2xl mx-auto">
            Beskriv jobben du trenger hjelp med, så kobler vi deg med riktig håndverker.
          </p>
        </div>

        <Card className="glass-surface-light border-slate-500/10 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="service_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-forest-900 font-semibold">Hva trenger du hjelp med?</FormLabel>
                      <FormControl>
                        <NordicSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Velg tjeneste"
                          options={SERVICE_CATEGORIES}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="job_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-forest-900 font-semibold">Beskriv jobben</FormLabel>
                      <FormControl>
                        <NordicTextarea
                          placeholder="Fortell oss hva du trenger hjelp med. Jo mer detaljert, jo bedre."
                          className="resize-none h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-forest-900 font-semibold">Sted eller adresse</FormLabel>
                        <FormControl>
                          <NordicInput placeholder="F.eks. Storgata 5, Oslo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferred_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-forest-900 font-semibold">Når passer det best?</FormLabel>
                        <FormControl>
                          <NordicInput placeholder="F.eks. neste uke, ettermiddager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="text-center pt-4">
                  <Button type="submit" disabled={isSubmitting} size="lg" className="bg-amber-500 hover:bg-copper-500 text-white font-bold px-8 transition-all hover:shadow-lg hover:shadow-amber-500/20">
                    {isSubmitting
                      ? "Sender forespørsel..."
                      : "Finn en håndverker"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
