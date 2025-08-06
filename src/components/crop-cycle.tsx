import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Tractor, TestTube2, Shield, Wheat, Warehouse } from "lucide-react";

const cycleStages = [
  { name: "Sowing", description: "Planting seeds at optimal depth.", icon: <Tractor className="h-8 w-8 text-primary"/> },
  { name: "Growth", description: "Careful watering and nutrient management.", icon: <Sprout className="h-8 w-8 text-primary"/> },
  { name: "Fertilization", description: "Applying nutrients for robust growth.", icon: <TestTube2 className="h-8 w-8 text-primary"/> },
  { name: "Pest Control", description: "Monitoring and managing threats.", icon: <Shield className="h-8 w-8 text-primary"/> },
  { name: "Harvesting", description: "Collecting mature crops at the right time.", icon: <Wheat className="h-8 w-8 text-primary"/> },
  { name: "Post-Harvest", description: "Processing, storing, and field prep.", icon: <Warehouse className="h-8 w-8 text-primary"/> },
];

export default function CropCycle() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>3. Crop Cycle Timeline</CardTitle>
        <CardDescription>A general timeline for a typical crop cycle. Adapt based on your specific crop.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cycleStages.map((stage) => (
            <Card key={stage.name} className="bg-background/50">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    {stage.icon}
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{stage.description}</p>
                </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
