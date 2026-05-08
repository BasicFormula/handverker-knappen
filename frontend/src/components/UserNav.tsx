import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const user = useUser();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "T";
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-12 w-12 rounded-full
                     ring-2 ring-amber-500/40 hover:ring-amber-400/60
                     bg-gradient-to-br from-slate-800/50 to-slate-900/50
                     backdrop-blur-sm
                     shadow-[0_4px_16px_rgba(217,119,6,0.2)]
                     hover:shadow-[0_6px_24px_rgba(217,119,6,0.4)]
                     transition-all duration-300
                     hover:scale-105"
        >
          <Avatar className="h-11 w-11 border-2 border-copper-500/30">
            <AvatarImage src={user.avatarUrl || ''} alt={user.displayName || ''} />
            <AvatarFallback className="bg-gradient-to-br from-forest-800 to-slate-900 text-amber-200 font-bold tracking-wider text-lg">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-gradient-to-br from-forest-900/95 via-slate-800/95 to-slate-900/95
                   backdrop-blur-xl border-2 border-slate-700/50
                   shadow-[0_12px_48px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.1)]
                   [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]"
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="font-normal pb-3">
          <div className="flex flex-col space-y-1.5">
            <p className="text-base font-bold text-amber-200 tracking-wide">
              {user.displayName}
            </p>
            <p className="text-sm text-slate-400 font-medium">
              {user.primaryEmail?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => navigate("/my-assignments-page")}
            className="text-offwhite hover:text-amber-200 hover:bg-slate-800/60
                       font-semibold tracking-wide cursor-pointer
                       transition-all duration-200
                       focus:bg-slate-800/60 focus:text-amber-200"
          >
            Mine Oppdrag (Kunde)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate("/craftsman-dashboard")}
            className="text-offwhite hover:text-amber-200 hover:bg-slate-800/60
                       font-semibold tracking-wide cursor-pointer
                       transition-all duration-200
                       focus:bg-slate-800/60 focus:text-amber-200"
          >
            Håndverker Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate("/admin-dashboard-page")}
            className="text-offwhite hover:text-amber-200 hover:bg-slate-800/60
                       font-semibold tracking-wide cursor-pointer
                       transition-all duration-200
                       focus:bg-slate-800/60 focus:text-amber-200"
          >
            Admin Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate("/edit-craftsman-profile")}
            className="text-offwhite hover:text-amber-200 hover:bg-slate-800/60
                       font-semibold tracking-wide cursor-pointer
                       transition-all duration-200
                       focus:bg-slate-800/60 focus:text-amber-200"
          >
            Rediger Profil
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate("/service-request-page")}
            className="text-offwhite hover:text-amber-200 hover:bg-slate-800/60
                       font-semibold tracking-wide cursor-pointer
                       transition-all duration-200
                       focus:bg-slate-800/60 focus:text-amber-200"
          >
            Nytt Oppdrag
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
        <DropdownMenuItem 
          onClick={() => navigate("/auth/sign-out")}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20
                     font-bold tracking-wide cursor-pointer
                     transition-all duration-200
                     focus:bg-red-900/20 focus:text-red-300"
        >
          Logg ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
