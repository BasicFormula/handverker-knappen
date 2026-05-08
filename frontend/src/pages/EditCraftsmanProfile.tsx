import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { CraftsmanProfile, UpdateCraftsmanProfile } from "types";
import { useUserGuardContext } from "app/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/MultiSelect";
import { ImageUpload } from "@/components/ImageUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/utils/hooks";
import { CheckCircle2, Loader, AlertTriangle, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES } from "utils/services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type CraftsmanProfileFormState = Partial<UpdateCraftsmanProfile> & {
  profile_photo_url?: string | null;
  business_reg_number?: string | null;
};

const getInitials = (name: string | undefined) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-brand-slate">
        <Header />
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-surface-light border-brand-slate/20">
                        <CardHeader>
                            <Skeleton className="h-8 w-1/2 bg-brand-slate/10" />
                            <Skeleton className="h-4 w-1/3 bg-brand-slate/10" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Skeleton className="h-16 w-full bg-brand-slate/10" />
                                <Skeleton className="h-16 w-full bg-brand-slate/10" />
                            </div>
                            <Skeleton className="h-16 w-full bg-brand-slate/10" />
                            <Separator className="bg-brand-slate/10" />
                            <Skeleton className="h-24 w-full bg-brand-slate/10" />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="glass-surface-light border-brand-slate/20 sticky top-24">
                        <CardHeader>
                            <Skeleton className="h-7 w-1/2 bg-brand-slate/10" />
                            <Skeleton className="h-4 w-2/3 bg-brand-slate/10" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-40 w-full bg-brand-slate/10" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        <Footer />
    </div>
);

const areaOptions = [
    { label: "Oslo", value: "oslo" },
    { label: "Bergen", value: "bergen" },
    { label: "Trondheim", value: "trondheim" },
    { label: "Stavanger", value: "stavanger" },
    { label: "Drammen", value: "drammen" },
    { label: "Kristiansand", value: "kristiansand" },
    { label: "Tromsø", value: "tromso" },
];

export default function CraftsmanProfileEdit() {
    const navigate = useNavigate();
    const { user } = useUserGuardContext();
    const userRef = useRef(user);
    userRef.current = user;
    
    const [initialLoad, setInitialLoad] = useState(true);
    const [profile, setProfile] = useState<CraftsmanProfileFormState>({});
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">(
      "idle"
    );
    
    const debouncedProfile = useDebounce(profile, 1000);

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await brain.get_current_craftsman_profile();
          if (response.ok) {
            const data: CraftsmanProfile = await response.json();
            setProfile(data);
          } else {
            const currentUser = userRef.current;
            const defaultProfile: CraftsmanProfileFormState = {
              business_name: currentUser.fullName || "",
              phone_number: currentUser.primaryPhoneNumber?.e164 ?? "",
              profile_photo_url: currentUser.picture ?? "",
              services: [],
              service_areas: [],
              experience_level: "",
              pricing_info: "",
              business_reg_number: "",
            };
            setProfile(defaultProfile);
            toast.info("Velkommen! Vennligst fullfør profilen din.");
          }
        } catch (e) {
          toast.error("Kunne ikke laste profilen din.");
          console.error(e);
        } finally {
          setInitialLoad(false);
        }
      };

      if (user?.id) {
        fetchProfile();
      }
    }, [user?.id]);
    
    const updateProfile = useCallback(async () => {
      if (Object.keys(debouncedProfile).length === 0 || initialLoad) return;
      setSaveStatus("saving");
      try {
        const payload: UpdateCraftsmanProfile = {
          business_name: debouncedProfile.business_name,
          phone_number: debouncedProfile.phone_number,
          experience_level: debouncedProfile.experience_level,
          pricing_info: debouncedProfile.pricing_info,
          services: debouncedProfile.services,
          service_areas: debouncedProfile.service_areas,
        };
        await brain.update_craftsman_profile(payload);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        setSaveStatus("error");
        toast.error("Kunne ikke lagre profilendringer.");
        console.error(error);
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    }, [debouncedProfile, initialLoad]);

    useEffect(() => {
      if (!initialLoad) {
        updateProfile();
      }
    }, [debouncedProfile, initialLoad, updateProfile]);


    const handleInputChange = (
      field: keyof CraftsmanProfileFormState,
      value: any
    ) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
    };

    if (initialLoad) {
      return <LoadingSkeleton />;
    }
    
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-600 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 relative">
        {/* Background elements */}
        <div className="absolute inset-0 nordic-pattern opacity-5 pointer-events-none -z-10"></div>
        
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-slate-600 hover:text-forest-900 hover:bg-slate-600/10 pl-0 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="w-full glass-surface-light border-slate-600/20 shadow-lg">
              <CardHeader className="bg-white/50 border-b border-slate-600/10">
                <CardTitle className="text-2xl font-bold text-forest-900">Rediger din profil</CardTitle>
                <CardDescription className="text-slate-600/70">Oppdater din profesjonelle informasjon her. Slik vil kundene se deg.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="business_name" className="text-forest-900 font-semibold">Firmanavn</Label>
                        <Input id="business_name" value={profile.business_name || ''} onChange={(e) => handleInputChange('business_name', e.target.value)} className="bg-white/80 border-slate-600/20 focus:border-amber-500 focus:ring-amber-500"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number" className="text-forest-900 font-semibold">Telefonnummer</Label>
                        <Input id="phone_number" value={profile.phone_number || ''} onChange={(e) => handleInputChange('phone_number', e.target.value)} className="bg-white/80 border-slate-600/20 focus:border-amber-500 focus:ring-amber-500"/>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="business_reg_number" className="text-forest-900 font-semibold">Organisasjonsnummer</Label>
                    <Input id="business_reg_number" value={profile.business_reg_number || ''} onChange={(e) => handleInputChange('business_reg_number', e.target.value)} className="bg-white/80 border-slate-600/20 focus:border-amber-500 focus:ring-amber-500"/>
                 </div>
                 <Separator className="bg-slate-600/10" />
                <div className="space-y-2">
                  <Label className="text-forest-900 font-semibold">Profilbilde</Label>
                  <ImageUpload 
                    onUploadSuccess={(url) => handleInputChange('profile_photo_url', url)}
                    currentImageUrl={profile.profile_photo_url}
                    fallbackText={getInitials(profile.business_name)}
                  />
                </div>
                 <Separator className="bg-slate-600/10" />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="experience_level" className="text-forest-900 font-semibold">Erfaring</Label>
                        <Textarea id="experience_level" value={profile.experience_level || ''} onChange={(e) => handleInputChange('experience_level', e.target.value)} placeholder="Beskriv din erfaring..." className="bg-white/80 border-slate-600/20 focus:border-amber-500 focus:ring-amber-500 min-h-[120px]"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pricing_info" className="text-forest-900 font-semibold">Prisinformasjon</Label>
                        <Textarea id="pricing_info" value={profile.pricing_info || ''} onChange={(e) => handleInputChange('pricing_info', e.target.value)} placeholder="Beskriv din prismodell..." className="bg-white/80 border-slate-600/20 focus:border-amber-500 focus:ring-amber-500 min-h-[120px]"/>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-forest-900 font-semibold">Tjenester du tilbyr</Label>
                    <MultiSelect
                        options={SERVICE_CATEGORIES}
                        onValueChange={(values) => handleInputChange('services', values)}
                        defaultValue={profile.services || []}
                        placeholder="Velg tjenester"
                        variant="default" 
                        maxCount={5}
                        className="bg-white/80 border-slate-600/20"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-forest-900 font-semibold">Områder du dekker</Label>
                    <MultiSelect
                        options={areaOptions}
                        onValueChange={(values) => handleInputChange('service_areas', values)}
                        defaultValue={profile.service_areas || []}
                        placeholder="Velg områder"
                        variant="default"
                        maxCount={5}
                        className="bg-white/80 border-slate-600/20"
                    />
                 </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="glass-surface-light border-slate-600/20 sticky top-24 shadow-lg">
              <CardHeader className="bg-white/50 border-b border-slate-600/10">
                <CardTitle className="text-xl font-bold flex items-center text-forest-900">
                  Forhåndsvisning
                  <span className="ml-auto">
                    {saveStatus === 'saving' && <Loader className="animate-spin h-5 w-5 text-amber-500" />}
                    {saveStatus === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {saveStatus === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-600/70">
                  Slik vil profilen din se ut for kunder.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-24 w-24 border-2 border-slate-600/20 ring-2 ring-white shadow-md">
                    <AvatarImage
                      src={profile.profile_photo_url}
                      alt={profile.business_name}
                    />
                    <AvatarFallback className="type-headline bg-slate-600/10 text-forest-900">
                      {getInitials(profile.business_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="type-headline-md text-forest-900">
                      {profile.business_name || <span className="text-slate-600/40 italic">Firmanavn</span>}
                    </h2>
                    <p className="type-body">
                      {profile.phone_number || <span className="text-slate-600/40 italic">Telefonnr.</span>}
                    </p>
                    {profile.business_reg_number && (
                      <p className="text-sm text-slate-600/60 mt-1">
                        Org.nr: {profile.business_reg_number}
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="bg-slate-600/10" />

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-forest-900">Erfaring</h3>
                    <p className="text-slate-600/80 whitespace-pre-wrap text-sm leading-relaxed">
                      {profile.experience_level || "Ingen informasjon om erfaring."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-forest-900">Priser</h3>
                    <p className="text-slate-600/80 whitespace-pre-wrap text-sm leading-relaxed">
                      {profile.pricing_info || "Ingen prisinformasjon."}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 text-forest-900">Tjenester</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.services && profile.services.length > 0 ? (
                      profile.services.map((service) => {
                        const serviceLabel =
                          SERVICE_CATEGORIES.find((opt) => opt.value === service)
                            ?.label || service;
                        return <Badge key={service} variant="secondary" className="bg-amber-500/10 text-forest-900 border-amber-500/20">{serviceLabel}</Badge>;
                      })
                    ) : (
                      <p className="text-sm text-slate-600/50 italic">Ingen tjenester valgt.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 text-forest-900">Dekningsområder</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.service_areas &&
                    profile.service_areas.length > 0 ? (
                      profile.service_areas.map((area) => {
                        const areaLabel =
                          areaOptions.find((opt) => opt.value === area)?.label ||
                          area;
                        return (
                          <Badge key={area} variant="outline" className="bg-white text-slate-600 border-slate-600/20">
                            {areaLabel}
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-600/50 italic">
                        Ingen dekningsområder valgt.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      </div>
    );
}
