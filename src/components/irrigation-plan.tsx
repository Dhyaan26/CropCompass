

"use client";

import { useState, useEffect } from "react";
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
import { Loader2, CalendarClock, Recycle, Droplets, Forward } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "./ui/calendar";
import { addDays, format, parse, isAfter, startOfToday } from "date-fns";

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
  cropType: z.string().min(2, { message: "Crop type is required." }),
  soilType: z.string({ required_error: "Please select a soil type." }),
  state: z.string({ required_error: "Please select a state." }),
  district: z.string({ required_error: "Please select a district." }),
  waterAccess: z.string().min(5, { message: "Describe your water access." }),
});

type ScheduleEntry = {
    date: string;
    task: string;
};

export default function IrrigationPlan() {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculateIrrigationScheduleOutput | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [nextWateringDay, setNextWateringDay] = useState<ScheduleEntry | null>(null);
  
  const indianStates = t('indianStates') as any;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      waterAccess: "",
    },
  });
  
  const scheduleMap = result?.schedule.reduce((acc, item) => {
    const date = new Date(`${item.date}T00:00:00`);
    acc.set(format(date, 'yyyy-MM-dd'), item.task);
    return acc;
  }, new Map<string, string>());
  
  useEffect(() => {
    if (result?.schedule) {
      const today = startOfToday();
      const nextDay = result.schedule
        .map(item => ({...item, parsedDate: parse(item.date, 'yyyy-MM-dd', new Date())}))
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
        .find(item => isAfter(item.parsedDate, today) || format(item.parsedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'));
      
      setNextWateringDay(nextDay || null);
    } else {
      setNextWateringDay(null);
    }
  }, [result]);


  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const input: CalculateIrrigationScheduleInput = {
        location: `${data.district}, ${data.state}`,
        cropType: data.cropType,
        soilType: data.soilType,
        waterAccess: data.waterAccess,
        language,
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

  const districtsForSelectedState = selectedState && indianStates && indianStates[selectedState as keyof typeof indianStates] ? indianStates[selectedState as keyof typeof indianStates] : [];


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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('irrigationPlan.soilTypePlaceholder')} />
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
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('irrigationPlan.stateLabel')}</FormLabel>
                    <Select onValueChange={handleStateChange}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('irrigationPlan.statePlaceholder')} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {indianStates && Object.keys(indianStates).sort().map(state => (
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
                    <FormLabel>{t('irrigationPlan.districtLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('irrigationPlan.districtPlaceholder')} />
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
           <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <CalendarClock className="h-8 w-8 text-accent" />
                    <div>
                        <CardTitle>{t('irrigationPlan.results.schedule')}</CardTitle>
                        <CardDescription>{t('irrigationPlan.results.scheduleDesc')}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                     <Calendar
                        mode="single"
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                        disabled={{ before: new Date(), after: addDays(new Date(), 30)}}
                        modifiers={{
                            wateringDay: (date) => scheduleMap?.has(format(date, 'yyyy-MM-dd')) || false,
                        }}
                        modifiersStyles={{
                            wateringDay: {
                                border: "2px solid hsl(var(--primary))",
                                color: "hsl(var(--primary))",
                                fontWeight: 'bold'
                            }
                        }}
                    />
                    <div className="mt-4 p-4 bg-muted rounded-lg min-h-[60px]">
                        <h4 className="font-semibold">{selectedDay ? format(selectedDay, 'PPP') : 'Select a day'}</h4>
                        <p className="text-sm text-muted-foreground">
                            {selectedDay && scheduleMap?.get(format(selectedDay, 'yyyy-MM-dd'))
                                ? scheduleMap.get(format(selectedDay, 'yyyy-MM-dd'))
                                : t('irrigationPlan.results.noTask')}
                        </p>
                    </div>
                </CardContent>
             </Card>
             <div className="space-y-8">
                {nextWateringDay && (
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Forward className="h-8 w-8 text-accent" />
                            <div>
                                <CardTitle>{t('irrigationPlan.results.nextWatering')}</CardTitle>
                                <CardDescription>{format(new Date(`${nextWateringDay.date}T00:00:00`), 'PPP')}</CardDescription>
                            </div>
                        </CardHeader>
                         <CardContent>
                            <p className="text-sm text-muted-foreground">{nextWateringDay.task}</p>
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Droplets className="h-8 w-8 text-accent" />
                        <div>
                        <CardTitle>{t('irrigationPlan.results.legend')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-md border-2 border-primary text-primary font-bold flex items-center justify-center">
                                {new Date().getDate()}
                            </div>
                            <span className="text-sm text-muted-foreground">{t('irrigationPlan.results.wateringDay')}</span>
                        </div>
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
           </div>
        )}
      </CardContent>
    </Card>
  );
}
