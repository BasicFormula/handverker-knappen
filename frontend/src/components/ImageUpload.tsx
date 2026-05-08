import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import brain from "brain";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  fallbackText: string;
}

export const ImageUpload = ({ onUploadSuccess, currentImageUrl, fallbackText }: ImageUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vennligst velg en fil å laste opp.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await brain.upload_profile_photo({ file });
      if (response.ok) {
        const data = await response.json();
        onUploadSuccess(data.profile_photo_url);
        toast.success("Profilbilde lastet opp!");
      } else {
        toast.error("Kunne ikke laste opp profilbilde.");
      }
    } catch (error) {
      toast.error("En feil oppstod under opplasting.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-24 w-24 border-2 border-slate-400/30">
        <AvatarImage src={preview || currentImageUrl} alt="Forhåndsvisning" />
        <AvatarFallback className="bg-slate-100 text-forest-900 font-bold">{fallbackText}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="flex gap-2">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-slate-400/30 text-slate-700 hover:text-forest-900 hover:bg-slate-100 transition-all">
                Velg Bilde
            </Button>
            {file && (
            <Button onClick={handleUpload} className="bg-amber-500 hover:bg-copper-500 text-white font-bold transition-all hover:shadow-lg hover:shadow-amber-500/20">
                Last Opp
            </Button>
            )}
        </div>
      </div>
    </div>
  );
};
