
"use client";

import AppHeader from '@/components/header';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-grow">
        <section className="container mx-auto grid lg:grid-cols-2 gap-12 items-center py-12 md:py-24">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="mb-4 text-4xl font-bold text-primary/90 font-headline md:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl lg:mx-0">
              {t('home.subtitle')}
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">
                {t('dashboard.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Smart farming illustration" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-2xl"
              data-ai-hint="agriculture technology"
            />
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
