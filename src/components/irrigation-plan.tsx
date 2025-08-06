"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  calculateIrrigationSchedule,
  type CalculateIrrigationScheduleInput,
  type CalculateIrrigationScheduleOutput,
} from "@/ai/flows/calculate-irrigation-schedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarClock, Recycle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const formSchema = z.object({
  cropType: z.string().min(2, { message: "Crop type is required." }),
  soilType: z.string().min(2, { message: "Soil type is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  waterAccess: z.string().min(5, { message: "Describe your water access." }),
});

export default function IrrigationPlan() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculateIrrigationScheduleOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      soilType: "",
      location: "",
      waterAccess: "",
    },
  });

  const onSubmit: SubmitHandler<CalculateIrrigationScheduleInput> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await calculateIrrigationSchedule(data);
      setResult(response);
    } catch (error) {
      console.error("Error calculating irrigation schedule:", error);
      toast({
        variant: "destructive",
        title: t('toasts.error'),
        description: t('toasts.irrigationPlanError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t('irrigationPlan.title')}</CardTitle>
        <CardDescription>{t('irrigationPlan.description')}</CardDescription>
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
                    <FormLabel>{t('irrigationPlan.cropTypeLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('irrigationPlan.cropTypePlaceholder')} {...field} />
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
                    <FormLabel>{t('irrigationPlan.soilTypeLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('irrigationPlan.soilTypePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('irrigationPlan.locationLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('irrigationPlan.locationPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waterAccess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('irrigationPlan.waterAccessLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('irrigationPlan.waterAccessPlaceholder')} {...field} />
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
                  {t('irrigationPlan.calculating')}
                </>
              ) : (
                t('irrigationPlan.button')
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <CalendarClock className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('irrigationPlan.results.schedule')}</CardTitle>
                  <CardDescription>{t('irrigationPlan.results.scheduleDesc')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{result.irrigationSchedule}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Recycle className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('irrigationPlan.results.conservation')}</CardTitle>
                  <CardDescription>{t('irrigationPlan.results.conservationDesc')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                 <p className="whitespace-pre-wrap text-muted-foreground">{result.waterConservationTips}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
