
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';

export const SidebarClose = () => {
  return (
    <SheetClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        aria-label="Fermer la navigation"
      >
        <X className="h-4 w-4" />
      </Button>
    </SheetClose>
  );
};
