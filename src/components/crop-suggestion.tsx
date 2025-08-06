
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  suggestOptimalCrops,
  type SuggestOptimalCropsInput,
  type SuggestOptimalCropsOutput,
} from "@/ai/flows/suggest-optimal-crops";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ListChecks, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const indianStates = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "West Godavari"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Lower Subansiri", "Upper Subansiri"],
  "Assam": ["Dhubri", "Kamrup", "Nagaon", "Sonitpur", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  "Chhattisgarh": ["Raipur", "Durg", "Bilaspur", "Korba", "Raigarh"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Faridabad", "Gurugram", "Hisar", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Kangra", "Mandi", "Solan", "Una"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  "Karnataka": ["Bengaluru Urban", "Belagavi", "Dakshina Kannada", "Mysuru", "Shivamogga", "Tumakuru", "Udupi"],
  "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur"],
  "Manipur": ["Imphal West", "Imphal East", "Thoubal", "Bishnupur"],
  "Meghalaya": ["East Khasi Hills", "West Garo Hills", "Jaintia Hills"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Dimapur", "Kohima", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Ganjam", "Sambalpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "Sikkim": ["East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ranga Reddy"],
  "Tripura": ["West Tripura", "North Tripura", "South Tripura", "Dhalai"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Udhham Singh Nagar"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Nadia", "Murshidabad"],
};


const soilTypes = [
    "Alluvial Soil",
    "Black Soil (Regur Soil)",
    "Red and Yellow Soil",
    "Laterite Soil",
    "Arid Soil",
    "Saline Soil",
    "Peaty Soil",
    "Forest Soil",
];


const formSchema = z.object({
  state: z.string({ required_error: "Please select a state." }),
  district: z.string({ required_error: "Please select a district." }),
  soilType: z.string({ required_error: "Please select a soil type." }),
  resources: z.string().min(10, { message: "Please describe your available resources." }),
});

export default function CropSuggestion() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalCropsOutput | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resources: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const input: SuggestOptimalCropsInput = {
        location: `${data.district}, ${data.state}`,
        soilType: data.soilType,
        resources: data.resources,
      }
      const response = await suggestOptimalCrops(input);
      setResult(response);
    } catch (error) {
      console.error("Error getting crop suggestions:", error);
      toast({
        variant: "destructive",
        title: t('toasts.error'),
        description: t('toasts.cropSuggestionError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    form.setValue("state", value);
    form.resetField("district");
  }

  return (
    <Card className="shadow-lg w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t('cropSuggestion.title')}</CardTitle>
        <CardDescription className="text-center">{t('cropSuggestion.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={handleStateChange}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.keys(indianStates).sort().map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a district" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {selectedState && indianStates[selectedState as keyof typeof indianStates].sort().map(district => (
                                <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cropSuggestion.soilTypeLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('cropSuggestion.soilTypePlaceholder')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {soilTypes.map(soil => (
                                <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="resources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cropSuggestion.resourcesLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('cropSuggestion.resourcesPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('cropSuggestion.analyzing')}
                </>
              ) : (
                t('cropSuggestion.button')
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <ListChecks className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('cropSuggestion.results.recommendedCrops')}</CardTitle>
                  <CardDescription>{t('cropSuggestion.results.recommendedCropsDesc')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {result.crops.map((crop, index) => (
                    <li key={index} className="rounded-lg border bg-background/50 p-3 text-center font-medium">
                      {crop}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('cropSuggestion.results.aiReasoning')}</CardTitle>
                  <CardDescription>{t('cropSuggestion.results.aiReasoningDesc')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
