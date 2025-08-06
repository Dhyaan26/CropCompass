"use client";

import AppHeader from '@/components/header';
import ChatWidget from '@/components/chat-widget';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-background/50">
        <AppHeader />
        <main className="container mx-auto flex-grow p-4 md:p-6 lg:p-8">
           <section className="text-center">
             <h1 className="mb-4 text-4xl font-bold text-primary/90 font-headline md:text-6xl">
                {t('home.title')}
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl mb-8">
                {t('home.subtitle')}
              </p>
              <Button asChild size="lg">
                <Link href="/dashboard">
                  {t('dashboard.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <div className="relative mt-12 w-full max-w-5xl mx-auto h-[500px] shadow-2xl rounded-lg overflow-hidden">
                <Image 
                    src="https://placehold.co/1200x800.png" 
                    alt="Farm landscape" 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="farm landscape"
                    className="brightness-90"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
           </section>
        </main>
        <ChatWidget />
        <footer className="mt-12 border-t py-6">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
            </div>
        </footer>
    </div>
  );
}
