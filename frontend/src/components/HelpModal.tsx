import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function HelpModal() {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-forest-900">Trenger du hjelp?</DialogTitle>
        <DialogDescription className="text-slate-600">
          Kontakt oss hvis du har spørsmål eller trenger assistanse.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4 text-slate-700">
        <div>
          <h3 className="font-semibold text-forest-900">E-post</h3>
          <a
            href="mailto:support@masters-as.no"
            className="text-amber-500 hover:text-copper-500 hover:underline transition-colors"
          >
            support@masters-as.no
          </a>
        </div>
        <div>
          <h3 className="font-semibold text-forest-900">Telefon</h3>
          <a
            href="tel:+4795183453"
            className="text-amber-500 hover:text-copper-500 hover:underline transition-colors"
          >
            +47 951 83 453
          </a>
        </div>
      </div>
    </>
  );
}
