import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NordicInput } from "components/NordicInput";
import { NordicSelect } from "components/NordicSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import brain from "brain";
import { SERVICE_CATEGORIES } from "utils/services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MultiSelect } from "@/components/MultiSelect";
import { CheckCircle2, Upload, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { APP_BASE_PATH } from "app";

// --- Schema Definition ---

const formSchema = z.object({
  // Step 1: Info
  companyName: z.string().min(2, "Firmanavn må ha minst 2 tegn."),
  orgNumber: z.string().regex(/^\d{9}$/, "Ugyldig organisasjonsnummer (9 siffer)."),
  contactName: z.string().min(2, "Navn må ha minst 2 tegn."),
  email: z.string().email("Ugyldig e-postadresse."),
  phone: z.string().regex(/^(?:\+47)?\d{8}$/, "Ugyldig telefonnummer (8 siffer)."),
  
  // Step 2: Services & Area
  services: z.array(z.string()).min(1, "Velg minst én tjeneste."),
  serviceArea: z.enum(["oslo", "other"], {
    required_error: "Du må velge et dekningsområde.",
  }),

  // Step 3: Verification (internal state mostly, but validated before next)
  verificationMethod: z.enum(["bankid", "kyc", "none"]).optional(),
  idDocumentUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function HandverkerRegistrering() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // From backend
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      orgNumber: "",
      contactName: "",
      email: "",
      phone: "",
      services: [],
      serviceArea: "oslo",
      verificationMethod: "none",
      idDocumentUrl: "",
    },
    mode: "onChange",
  });

  // Fetch initial profile data to check verification status or pre-fill
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await brain.get_current_craftsman_profile();
        if (response.ok) {
          const profile = await response.json();
          // Pre-fill form if data exists
          if (profile.business_name) form.setValue("companyName", profile.business_name);
          if (profile.org_number) form.setValue("orgNumber", profile.org_number);
          if (profile.phone_number) form.setValue("phone", profile.phone_number);
          if (profile.name) form.setValue("contactName", profile.name);
          if (profile.email) form.setValue("email", profile.email);
          if (profile.services && profile.services.length > 0) {
              // Assuming services comes as array of objects or strings depending on backend. 
              // Backend returns string list in `services` field of `CraftsmanProfile` model?
              // Need to check API response structure. Model says `services: List[str]`.
              form.setValue("services", profile.services);
          }
          
          if (profile.is_verified || profile.bankid_verified) {
             setIsVerified(true);
             form.setValue("verificationMethod", "bankid"); // Assume bankid if verified
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [form]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ["companyName", "orgNumber", "contactName", "email", "phone"];
    } else if (step === 2) {
      fieldsToValidate = ["services", "serviceArea"];
    } else if (step === 3) {
      // Validation for step 3 handled manually or via schema if needed
      if (!isVerified && !form.getValues("idDocumentUrl")) {
        toast.error("Du må enten verifisere med BankID eller laste opp ID-dokument.");
        return;
      }
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      // Save progress to backend on each step?
      saveProgress(); 
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  const saveProgress = async () => {
    const values = form.getValues();
    // Convert serviceArea to list for backend if needed, or handle logic
    // Backend expects `service_areas` as List[str].
    // If 'oslo', send ['Oslo']. If 'other', maybe empty or ['Other']?
    const areaList = values.serviceArea === "oslo" ? ["Oslo"] : ["Other"];
    
    try {
        await brain.update_craftsman_profile({
            business_name: values.companyName,
            org_number: values.orgNumber,
            name: values.contactName,
            email: values.email,
            phone_number: values.phone,
            services: values.services,
            service_areas: areaList,
            id_document_url: values.idDocumentUrl
        }); 
    } catch (e) {
        console.error("Auto-save failed", e);
    }
  };
  
  const handleVerification = async (method: "bankid" | "vipps") => {
    const label = method === "vipps" ? "Vipps" : "BankID";
    const toastId = toast.loading(`Starter ${label}...`);
    try {
        const res = await brain.initiate_bankid_verification({ method });
        if (res.ok) {
            const data = await res.json();
            if (data.redirectUri) {
                window.location.href = data.redirectUri;
            } else {
                toast.error(`Kunne ikke starte ${label}. Mangler konfigurasjon?`, { id: toastId });
            }
        } else {
            toast.error(`Feil ved start av ${label}`, { id: toastId });
        }
    } catch (e) {
        toast.error("Nettverksfeil", { id: toastId });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Use the generated client to upload
      // @ts-ignore - brain client types might be lagging behind
      const res = await brain.upload_id_document({ file });
      
      if (res.ok) {
          const data = await res.json();
          form.setValue("idDocumentUrl", data.id_document_url);
          toast.success("Dokument lastet opp!");
      } else {
          toast.error("Opplasting feilet.");
      }
    } catch (err) {
        console.error(err);
        toast.error("Feil ved opplasting.");
    } finally {
        setIsUploading(false);
    }
  };

  const onSubmitFinal = async () => {
      // Final save and redirect
      await saveProgress();
      toast.success("Registrering fullført!");
      navigate("/purchase-leads"); // Step 4 leads here
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 nordic-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-forest-900/10 via-forest-700/5 to-transparent pointer-events-none"></div>
        
        <Card className="w-full max-w-2xl glass-surface-light border-slate-600/10 shadow-2xl relative z-10 overflow-hidden">
           <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-copper-600"></div>
           
           {/* Progress Indicator */}
           <div className="bg-slate-50/50 border-b border-slate-500/5 p-4 flex justify-between items-center px-8 md:px-12">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                            step >= s ? "bg-amber-500 text-white" : "bg-slate-600/10 text-slate-600"
                        }`}>
                            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                        </div>
                        <span className="text-xs mt-1 text-slate-600/70 font-medium hidden md:block">
                            {s === 1 ? "Info" : s === 2 ? "Tjenester" : s === 3 ? "Verifisering" : "Ferdig"}
                        </span>
                    </div>
                ))}
                {/* Connecting line */}
                <div className="absolute top-[4.5rem] left-12 right-12 h-0.5 bg-slate-600/10 -z-0 hidden md:block" />
           </div>

          <CardContent className="p-8">
            <Form {...form}>
              <form className="space-y-6">
                
                {/* STEP 1: GRUNNINFO */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-forest-900">Om din bedrift</h2>
                            <p className="text-slate-600/70">Start med å fylle ut grunnleggende informasjon.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Firmanavn</FormLabel>
                                    <FormControl>
                                    <NordicInput placeholder="Hansen & Co AS" {...field} className="h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="orgNumber"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Organisasjonsnummer</FormLabel>
                                    <FormControl>
                                    <NordicInput placeholder="987 654 321" {...field} className="h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Kontaktperson</FormLabel>
                                <FormControl>
                                <NordicInput placeholder="Ola Nordmann" {...field} className="h-12"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">E-post</FormLabel>
                                    <FormControl>
                                    <NordicInput type="email" placeholder="post@bedrift.no" {...field} className="h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Telefon</FormLabel>
                                    <FormControl>
                                    <NordicInput type="tel" placeholder="912 34 567" {...field} className="h-12"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: TJENESTER */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-forest-900">Tjenester og dekningsområde</h2>
                            <p className="text-slate-600/70">Fortell oss hva du kan tilby.</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="services"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Velg dine tjenester</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={SERVICE_CATEGORIES}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="Velg tjenester..."
                                            variant="secondary"
                                            className="bg-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceArea"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="font-bold">Dekningsområde</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:border-amber-500 [&:has([data-state=checked])>div]:bg-amber-500/5 cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value="oslo" className="sr-only" />
                                                    </FormControl>
                                                    <div className="border-2 border-slate-600/10 rounded-xl p-4 hover:border-amber-500/50 transition-all h-full flex items-center space-x-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'oslo' ? 'border-amber-500' : 'border-slate-600/30'}`}>
                                                            {field.value === 'oslo' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-forest-900">Oslo og omegn</div>
                                                            <div className="text-sm text-green-600 font-medium">Aktiv nå</div>
                                                        </div>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                            
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:border-slate-600/40 [&:has([data-state=checked])>div]:bg-slate-600/5 cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value="other" className="sr-only" />
                                                    </FormControl>
                                                    <div className="border-2 border-slate-600/10 rounded-xl p-4 hover:border-slate-600/30 transition-all h-full flex items-center space-x-3">
                                                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'other' ? 'border-slate-600' : 'border-slate-600/30'}`}>
                                                            {field.value === 'other' && <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-600">Andre steder</div>
                                                            <div className="text-sm text-amber-500 font-medium">Kommer snart</div>
                                                        </div>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    {field.value === 'other' && (
                                        <div className="bg-amber-500/10 text-amber-700 p-3 rounded-lg text-sm mt-2">
                                            Vi utvider snart til flere områder! Registrer deg gjerne nå for å stå først i køen.
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* STEP 3: VERIFISERING */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-forest-900">Verifisering</h2>
                            <p className="text-slate-600/70">For å sikre kvaliteten på plattformen må alle bedrifter verifiseres.</p>
                        </div>

                        {isVerified ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-green-800">Du er verifisert!</h3>
                                <p className="text-green-700">Din konto er godkjent og klar til bruk.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className={`cursor-pointer transition-all hover:border-amber-500 hover:shadow-md ${form.watch("verificationMethod") === "bankid" ? "border-amber-500 ring-1 ring-amber-500" : ""}`}
                                      onClick={() => form.setValue("verificationMethod", "bankid")}>
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center space-y-4">
                                        <div className="bg-blue-50 text-blue-600 font-bold p-2 rounded-full w-12 h-12 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-forest-900">Digital Verifisering</h3>
                                            <p className="text-sm text-slate-600/70">Velg din foretrukne metode for umiddelbar godkjenning.</p>
                                        </div>
                                        <div className="w-full space-y-2">
                                            <Button type="button" onClick={() => handleVerification("bankid")} className="w-full bg-[#5c2d91] hover:bg-[#4a2475] text-white">
                                                BankID
                                            </Button>
                                            <Button type="button" onClick={() => handleVerification("vipps")} className="w-full bg-[#ff5b24] hover:bg-[#e04a1f] text-white">
                                                Vipps
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className={`cursor-pointer transition-all hover:border-amber-500 hover:shadow-md ${form.watch("verificationMethod") === "kyc" ? "border-amber-500 ring-1 ring-amber-500" : ""}`}
                                      onClick={() => form.setValue("verificationMethod", "kyc")}>
                                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center space-y-4">
                                        <div className="bg-amber-500/10 text-amber-500 p-2 rounded-full w-12 h-12 flex items-center justify-center">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-forest-900">Manuell ID-sjekk</h3>
                                            <p className="text-sm text-slate-600/70">Last opp bilde av legitimasjon og firmattest.</p>
                                        </div>
                                        
                                        <div className="w-full">
                                            <Input 
                                                id="id-upload" 
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleFileUpload} 
                                                accept="image/*,.pdf"
                                            />
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="w-full mt-2 border-slate-600/20"
                                                onClick={() => document.getElementById("id-upload")?.click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? "Laster opp..." : form.watch("idDocumentUrl") ? "Dokument lastet opp!" : "Last opp dokument"}
                                            </Button>
                                            {form.watch("idDocumentUrl") && <p className="text-xs text-green-600 mt-1">Fil mottatt</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}
                
                {/* STEP 4: FULLFØRT */}
                 {step === 4 && (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-forest-900">Gratulerer!</h2>
                        <p className="text-xl text-slate-600/80">Din profil er nå opprettet.</p>
                        
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 max-w-md mx-auto my-8">
                            <h3 className="font-bold text-forest-900 mb-2">Hva skjer nå?</h3>
                            <p className="text-slate-600/80 mb-4">
                                For å motta oppdrag må du kjøpe leads-pakke. 
                                Vi har lanseringstilbud akkurat nå!
                            </p>
                            <Button 
                                className="w-full bg-amber-500 hover:bg-copper-600 text-white font-bold h-12 text-lg shadow-lg animate-pulse"
                                onClick={() => navigate("/purchase-leads")}
                            >
                                Kjøp Leads
                            </Button>
                        </div>
                        
                        <Button variant="ghost" onClick={() => navigate("/craftsman-dashboard")}>
                            Gå til Min Side
                        </Button>
                    </div>
                )}

                {/* NAVIGATION BUTTONS */}
                {step < 4 && (
                    <div className="flex justify-between pt-6 border-t border-slate-600/5 mt-8">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={prevStep} 
                            disabled={step === 1}
                            className={step === 1 ? "invisible" : ""}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Tilbake
                        </Button>
                        
                        <Button 
                            type="button" 
                            onClick={nextStep}
                            className="bg-forest-900 hover:bg-forest-900/90 text-white min-w-[120px]"
                        >
                            {step === 3 ? "Fullfør" : "Neste"}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
