import React from "react";
import { type CraftsmanPublicProfile } from "types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Phone } from "lucide-react";

interface CraftsmanResultCardProps {
  craftsman: CraftsmanPublicProfile;
}

export const CraftsmanResultCard: React.FC<CraftsmanResultCardProps> = ({
  craftsman,
}) => {
  return (
    <Card className="chamfered glass-surface-light border-slate-400/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:border-amber-500/30 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-forest-900">
              {craftsman.business_name}
            </h3>
            <div className="flex items-center mt-1">
              {craftsman.average_rating ? (
                <>
                  <p className="text-sm font-bold text-amber-500">
                    {craftsman.average_rating.toFixed(1)}
                  </p>
                  <Star className="w-4 h-4 ml-1 text-amber-500 fill-current" />
                  <p className="text-sm text-slate-600 ml-2">
                    ({craftsman.review_count} anmeldelser)
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Ingen anmeldelser</p>
              )}
            </div>
          </div>
          <img
            src={craftsman.profile_picture_url || '/placeholder-avatar.png'}
            alt={craftsman.business_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30"
          />
        </div>
        <p className="text-sm text-slate-700 mt-4 leading-relaxed line-clamp-3">
          {craftsman.bio}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {craftsman.services_offered?.map((service) => (
            <Badge key={service} variant="outline" className="border-slate-400/30 text-slate-700">
              {service}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 bg-forest-900/5 border-t border-slate-400/20 flex justify-end items-center">
        {craftsman.phone_number ? (
          <Button
            asChild
            className="bg-amber-500 hover:bg-copper-500 text-white type-cta transition-all hover:shadow-lg hover:shadow-amber-500/20"
          >
            <a href={`tel:${craftsman.phone_number}`}>
              <Phone className="w-4 h-4 mr-2" />
              Ring nå
            </a>
          </Button>
        ) : (
           <Button
            disabled
            className="bg-slate-300 text-slate-500 type-cta cursor-not-allowed"
          >
            <Phone className="w-4 h-4 mr-2" />
            Ingen telefon
          </Button>
        )}
      </div>
    </Card>
  );
};

export const CraftsmanCardSkeleton: React.FC = () => {
    return (
        <Card className="chamfered glass-surface-light border-slate-400/20 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="h-6 w-40 bg-slate-300 rounded-md animate-pulse" />
                        <div className="h-4 w-24 bg-slate-300 rounded-md animate-pulse" />
                    </div>
                    <div className="w-16 h-16 rounded-full bg-slate-300 animate-pulse" />
                </div>
                <div className="space-y-2 mt-4">
                    <div className="h-4 w-full bg-slate-300 rounded-md animate-pulse" />
                    <div className="h-4 w-5/6 bg-slate-300 rounded-md animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    <div className="h-6 w-20 bg-slate-300 rounded-full animate-pulse" />
                    <div className="h-6 w-24 bg-slate-300 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="p-4 bg-forest-900/5 border-t border-slate-400/20 flex justify-end items-center">
                <div className="h-10 w-24 bg-slate-300 rounded-md animate-pulse" />
            </div>
        </Card>
    );
};
