
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  cropType: z.string().min(2, { message: "Crop type is required." }),
  soilType: z.string().min(2, { message: "Soil type is required." }),
  state: z.string({ required_error: "Please select a state." }),
  district: z.string({ required_error: "Please select a district." }),
  waterAccess: z.string().min(5, { message: "Describe your water access." }),
});

export default function IrrigationPlan() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculateIrrigationScheduleOutput | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const { toast } = useToast();

  const indianStates = t('indianStates') as any;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      soilType: "",
      waterAccess: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const input: CalculateIrrigationScheduleInput = {
        location: `${data.district}, ${data.state}`,
        cropType: data.cropType,
        soilType: data.soilType,
        waterAccess: data.waterAccess,
      }
      const response = await calculateIrrigationSchedule(input);
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

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    form.setValue("state", value);
    form.resetField("district");
  }

  const districtsForSelectedState = selectedState && indianStates[selectedState] ? indianStates[selectedState] : [];


  return (
    <Card className="shadow-lg w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t('irrigationPlan.title')}</CardTitle>
        <CardDescription className="text-center">{t('irrigationPlan.description')}</CardDescription>
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
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cropSuggestion.stateLabel')}</FormLabel>
                    <Select onValueChange={handleStateChange}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('cropSuggestion.statePlaceholder')} />
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
                    <FormLabel>{t('cropSuggestion.districtLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('cropSuggestion.districtPlaceholder')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {districtsForSelectedState && districtsForSelectedState.sort().map((district: string) => (
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
                name="waterAccess"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
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
