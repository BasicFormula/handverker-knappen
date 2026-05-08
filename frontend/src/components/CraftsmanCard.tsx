import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { type CraftsmanPublicProfile } from "types";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifiedBadge } from "./VerifiedBadge";
import { Phone, MapPin, Briefcase, ChevronRight } from 'lucide-react';

interface Props {
  craftsman: CraftsmanPublicProfile;
}

export const CraftsmanCard = ({ craftsman }: Props) => {
  const navigate = useNavigate();

  const handleCallNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/call/${craftsman.user_id}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <Card 
      className="chamfered glass-surface-light border-slate-400/20 text-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/call/${craftsman.user_id}`)}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-amber-500/30 group-hover:border-copper-500 transition-colors duration-300">
            <AvatarImage src={craftsman.profile_image_url || undefined} alt={craftsman.name} />
            <AvatarFallback className="bg-amber-500/20 text-forest-900 text-xl font-bold">{getInitials(craftsman.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-forest-900 truncate group-hover:text-amber-500 transition-colors">{craftsman.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-600">{craftsman.company_name || 'Independent'}</p>
              {craftsman.is_verified && <VerifiedBadge isVerified={craftsman.is_verified} />}
            </div>
          </div>
        </div>

        <div className="my-4 space-y-2 text-sm flex-grow">
          <div className="flex items-start text-slate-700">
            <Briefcase className="w-4 h-4 mr-3 mt-1 text-slate-500 flex-shrink-0" />
            <span>{craftsman.services?.join(", ") || "No services listed"}</span>
          </div>
          <div className="flex items-start text-slate-700">
            <MapPin className="w-4 h-4 mr-3 mt-1 text-slate-500 flex-shrink-0" />
            <span>{craftsman.areas?.join(", ") || "No areas specified"}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 mt-auto bg-amber-500 group-hover:bg-copper-500 transition-all duration-300">
        <div
          className="w-full text-white font-bold text-lg flex items-center justify-center"
        >
          <Phone className="w-5 h-5 mr-3" />
          Se profil & ring
          <ChevronRight className="w-5 h-5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Card>
  );
};

export const CraftsmanCardSkeleton = () => {
  return (
    <Card className="chamfered glass-surface-light border-slate-400/20 p-5">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
       <div className="p-3 mt-5 h-12 bg-amber-500/20" />
    </Card>
  );
};
