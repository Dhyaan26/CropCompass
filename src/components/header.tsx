"use client";

import { Button } from "@/components/ui/button";
import { Leaf, Download } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "@/hooks/use-translation";

export default function AppHeader() {
  const { t } = useTranslation();
  const handleDownload = () => {
    // A simple print-to-PDF solution for modern browsers.
    try {
      window.print();
    } catch (error) {
      console.error("Print failed:", error);
      alert("Could not open print dialog. Please try again or use your browser's print function.");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm print:hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">AgroGPT</h1>
        </div>
        <p className="hidden md:block text-muted-foreground">{t('header.tagline')}</p>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            {t('header.downloadReport')}
          </Button>
        </div>
      </div>
    </header>
  );
}
