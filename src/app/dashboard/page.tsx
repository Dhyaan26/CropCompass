
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { BarChartBig, Droplets, Landmark, LineChart, Trees, Bug, MessageSquare } from "lucide-react";
import Link from "next/link";


export default function DashboardPage() {
    const { t } = useTranslation();

    const features = [
        { href: "/dashboard/crop-suggestions", icon: Trees, text: t('tabs.cropSuggestions') },
        { href: "/dashboard/irrigation-plan", icon: Droplets, text: t('tabs.irrigationPlan') },
        { href: "/dashboard/yield-prediction", icon: LineChart, text: t('tabs.yieldPrediction') },
        { href: "/dashboard/govt-schemes", icon: Landmark, text: t('tabs.govtSchemes') },
        { href: "/dashboard/farm-data-analytics", icon: BarChartBig, text: t('tabs.dataInsights') },
        { href: "/dashboard/pest-disease-detection", icon: Bug, text: t('tabs.pestDetection') },
        { href: "/dashboard/ai-assistant", icon: MessageSquare, text: t('tabs.aiAssistant') },
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
                    <Link href={feature.href} key={index}>
                        <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                            <CardHeader className="flex-row items-center gap-4">
                                <feature.icon className="h-10 w-10 text-accent" />
                                <CardTitle>{feature.text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    {t(
                                        `${feature.text.toLowerCase().replace(/ /g, '')}.description`, 
                                        {fallback: `Access the ${feature.text} module.`}
                                    )}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
