"use client";

import AppHeader from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { BarChartBig, Droplets, Landmark, LineChart, Trees } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { icon: Trees, text: t('tabs.cropSuggestions') },
    { icon: Droplets, text: t('tabs.irrigationPlan') },
    { icon: LineChart, text: t('tabs.yieldPrediction') },
    { icon: Landmark, text: t('tabs.govtSchemes') },
    { icon: BarChartBig, text: t('tabs.dataInsights') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      <main className="container mx-auto flex-grow p-4 md:p-6 lg:p-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-primary/90 font-headline md:text-5xl">
            {t('home.title')}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            {t('home.subtitle')}
          </p>
        </div>

        <Card className="mx-auto max-w-4xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t('dashboard.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 md:grid-cols-5">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <feature.icon className="h-8 w-8 text-accent" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/dashboard">{t('dashboard.cta')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

      </main>

      <footer className="mt-12 border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}
