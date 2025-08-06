
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Sun, FlaskConical, Bug, Combine, Package } from "lucide-react";

const stages = [
    {
        value: "sowing",
        title: "Sowing",
        icon: <Sprout className="mr-2 h-5 w-5" />,
        description: "This is the initial stage where seeds are planted. Proper seed selection, soil preparation, and planting depth are crucial for good germination. Timing is key and depends on the crop and local climate.",
    },
    {
        value: "growth",
        title: "Growth",
        icon: <Sun className="mr-2 h-5 w-5" />,
        description: "The growth phase involves germination, vegetative growth, and flowering. This stage requires consistent monitoring for water, sunlight, and nutrient needs to ensure healthy plant development.",
    },
    {
        value: "fertilization",
        title: "Fertilization",
        icon: <FlaskConical className="mr-2 h-5 w-5" />,
        description: "Applying the right nutrients at the right time is vital. Fertilization replenishes soil nutrients absorbed by the crop, ensuring it has the fuel to grow strong and produce a high yield. Soil testing can guide this process.",
    },
    {
        value: "pest-control",
        title: "Pest Control",
        icon: <Bug className="mr-2 h-5 w-5" />,
        description: "Integrated Pest Management (IPM) is essential. This includes monitoring for pests and diseases and using a combination of cultural, biological, and chemical methods to control them while minimizing environmental impact.",
    },
    {
        value: "harvesting",
        title: "Harvesting",
        icon: <Combine className="mr-2 h-5 w-5" />,
        description: "Harvesting at the correct time maximizes yield and quality. The method of harvesting (manual or mechanical) depends on the crop. Delays can lead to losses from pests or adverse weather.",
    },
    {
        value: "post-harvest",
        title: "Post-Harvest",
        icon: <Package className="mr-2 h-5 w-5" />,
        description: "This stage includes crucial activities like cleaning, sorting, grading, and proper storage of the harvested crop. Good post-harvest handling reduces losses and preserves the quality of the produce for the market.",
    },
];

export default function CropCycle() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Crop Cycle Timeline</CardTitle>
                <CardDescription>An overview of the key stages in a typical crop lifecycle.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="sowing" orientation="vertical" className="flex flex-col md:flex-row gap-6">
                    <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col md:w-1/4 h-auto">
                        {stages.map((stage) => (
                            <TabsTrigger key={stage.value} value={stage.value} className="w-full justify-start text-left p-3">
                                {stage.icon}
                                {stage.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="md:w-3/4">
                        {stages.map((stage) => (
                            <TabsContent key={stage.value} value={stage.value} className="mt-0">
                                <Card className="border-none shadow-none">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-xl">
                                            {stage.icon}
                                            {stage.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{stage.description}</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
