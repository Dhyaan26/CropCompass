"use client";

import AiInsights from '@/components/ai-insights';
import AppHeader from '@/components/header';
import CropSuggestion from '@/components/crop-suggestion';
import GovtSchemes from '@/components/govt-schemes';
import IrrigationPlan from '@/components/irrigation-plan';
import YieldPrediction from '@/components/yield-prediction';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import { BarChartBig, Droplets, Landmark, LineChart, Trees } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const features = [
      { value: "crop-suggestions", icon: Trees, label: t('tabs.cropSuggestions'), component: <CropSuggestion /> },
      { value: "irrigation-plan", icon: Droplets, label: t('tabs.irrigationPlan'), component: <IrrigationPlan /> },
      { value: "yield-prediction", icon: LineChart, label: t('tabs.yieldPrediction'), component: <YieldPrediction /> },
      { value: "govt-schemes", icon: Landmark, label: t('tabs.govtSchemes'), component: <GovtSchemes /> },
      { value: "data-insights", icon: BarChartBig, label: t('tabs.dataInsights'), component: <AiInsights /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background/50">
        <AppHeader />
        <main className="container mx-auto flex-grow p-4 md:p-6 lg:p-8">
            <div className="mb-8 text-center">
                <h2 className="mb-4 text-4xl font-bold text-primary/90 font-headline md:text-5xl">
                    {t('home.title')}
                </h2>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                    {t('home.subtitle')}
                </p>
            </div>
            <Tabs defaultValue="crop-suggestions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
                    {features.map((feature) => (
                        <TabsTrigger value={feature.value} key={feature.value} className="flex flex-col sm:flex-row gap-2 h-auto py-2">
                            <feature.icon className="h-5 w-5" />
                           <span>{feature.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                 {features.map((feature) => (
                    <TabsContent value={feature.value} key={feature.value} className="mt-6">
                        {feature.component}
                    </TabsContent>
                ))}
            </Tabs>
        </main>
        <footer className="mt-12 border-t py-6">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
            </div>
        </footer>
    </div>
  );
}
