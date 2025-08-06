
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { BarChartBig, Droplets, Landmark, LineChart, Trees, Bug } from "lucide-react";
import Link from "next/link";


export default function DashboardPage() {
    const { t } = useTranslation();

    const features = [
        { href: "/dashboard/crop-suggestions", icon: Trees, text: t('tabs.cropSuggestions'), description: t('cropsuggestions.description_short') },
        { href: "/dashboard/irrigation-plan", icon: Droplets, text: t('tabs.irrigationPlan'), description: t('irrigationplan.description_short') },
        { href: "/dashboard/yield-prediction", icon: LineChart, text: t('tabs.yieldPrediction'), description: t('yieldprediction.description_short') },
        { href: "/dashboard/govt-schemes", icon: Landmark, text: t('tabs.govtSchemes'), description: t('govtschemes.description_short') },
        { href: "/dashboard/farm-data-analytics", icon: BarChartBig, text: t('tabs.dataInsights'), description: t('farmdataanalytics.description_short') },
        { href: "/dashboard/pest-disease-detection", icon: Bug, text: t('tabs.pestDetection'), description: t('pestdetection.description_short') },
    ];

    return (
        <div>
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-3xl font-bold text-primary/90 font-headline md:text-4xl">
                    {t('dashboard.title')}
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <Link href={feature.href} key={index} className="rounded-lg transition-transform transform hover:scale-105">
                        <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                            <CardHeader className="flex-row items-center gap-4">
                                <feature.icon className="h-10 w-10 text-accent" />
                                <CardTitle>{feature.text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
