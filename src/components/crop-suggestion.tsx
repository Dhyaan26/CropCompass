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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ListChecks, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const formSchema = z.object({
  location: z.string().min(2, { message: "Location is required." }),
  soilType: z.string().min(2, { message: "Soil type is required." }),
  resources: z.string().min(10, { message: "Please describe your available resources." }),
});

export default function CropSuggestion() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalCropsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      soilType: "",
      resources: "",
    },
  });

  const onSubmit: SubmitHandler<SuggestOptimalCropsInput> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await suggestOptimalCrops(data);
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

  return (
    <Card className="shadow-lg w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t('cropSuggestion.title')}</CardTitle>
        <CardDescription className="text-center">{t('cropSuggestion.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cropSuggestion.locationLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('cropSuggestion.locationPlaceholder')} {...field} />
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
                    <FormLabel>{t('cropSuggestion.soilTypeLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('cropSuggestion.soilTypePlaceholder')} {...field} />
                    </FormControl>
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
