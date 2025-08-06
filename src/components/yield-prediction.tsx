"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  predictYield,
  type PredictYieldInput,
  type PredictYieldOutput,
} from "@/ai/flows/predict-yield";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Lightbulb, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  cropType: z.string().min(2, { message: "Crop type is required." }),
  soilType: z.string().min(2, { message: "Soil type is required." }),
  season: z.string({required_error: "Please select a season."}),
  location: z.string().min(2, { message: "Location is required." }),
});

export default function YieldPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictYieldOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      soilType: "",
      location: "",
    },
  });

  const onSubmit: SubmitHandler<PredictYieldInput> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await predictYield(data);
      setResult(response);
    } catch (error) {
      console.error("Error predicting yield:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to predict yield. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Yield Prediction</CardTitle>
        <CardDescription>Estimate your potential crop yield based on farming conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Rice, Cotton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Alluvial, Black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a cropping season" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Kharif">Kharif (Monsoon)</SelectItem>
                            <SelectItem value="Rabi">Rabi (Winter)</SelectItem>
                            <SelectItem value="Zaid">Zaid (Summer)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (e.g., District, State)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Guntur, Andhra Pradesh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Yield"
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <TrendingUp className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>Predicted Yield</CardTitle>
                  <CardDescription>{result.predictedYield}</CardDescription>
                </div>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>Influencing Factors</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{result.factors}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <CheckCircle className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>Recommendations for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                 <p className="whitespace-pre-wrap text-muted-foreground">{result.recommendations}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
