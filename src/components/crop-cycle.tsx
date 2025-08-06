"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sprout, Tractor, TestTube2, Shield, Wheat, Warehouse } from "lucide-react";

const cycleStages = [
  { name: "Sowing", value: "sowing", description: "This is the initial stage of planting seeds. It's crucial to ensure optimal seed depth and spacing for uniform germination. Soil temperature and moisture are key factors.", icon: <Tractor className="h-6 w-6 "/> },
  { name: "Growth", value: "growth", description: "During this phase, the plant develops its roots, stems, and leaves. Consistent watering, sunlight, and nutrient supply are vital for healthy vegetative growth.", icon: <Sprout className="h-6 w-6 "/> },
  { name: "Fertilization", value: "fertilization", description: "Applying the right nutrients at the right time boosts plant health and productivity. This stage often includes multiple applications based on crop needs and soil tests.", icon: <TestTube2 className="h-6 w-6 "/> },
  { name: "Pest Control", value: "pest-control", description: "Integrated Pest Management (IPM) is key. This includes regular monitoring for pests and diseases and using a combination of biological, cultural, and chemical controls.", icon: <Shield className="h-6 w-6 "/> },
  { name: "Harvesting", value: "harvesting", description: "Harvesting at the correct time and with the right methods is essential to maximize yield and quality. The timing is determined by crop maturity indicators.", icon: <Wheat className="h-6 w-6 "/> },
  { name: "Post-Harvest", value: "post-harvest", description: "This stage involves cleaning, sorting, grading, and properly storing the harvested produce. Good post-harvest handling reduces losses and maintains quality.", icon: <Warehouse className="h-6 w-6 "/> },
];

export default function CropCycle() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>3. Crop Cycle Timeline</CardTitle>
        <CardDescription>A general timeline for a typical crop cycle. Adapt based on your specific crop.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sowing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {cycleStages.map((stage) => (
              <TabsTrigger key={stage.value} value={stage.value}>
                {stage.icon} <span className="ml-2">{stage.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {cycleStages.map((stage) => (
             <TabsContent key={stage.value} value={stage.value} className="mt-6">
                <Card className="bg-background/50">
                    <CardHeader>
                        <CardTitle className="text-xl">{stage.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{stage.description}</p>
                    </CardContent>
                </Card>
             </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}