"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  findGovtSchemes,
  type FindGovtSchemesInput,
  type FindGovtSchemesOutput,
} from "@/ai/flows/find-govt-schemes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";

const formSchema = z.object({
  location: z.string().min(2, { message: "Location is required." }),
  farmerCategory: z.string({ required_error: "Please select a category." }),
});

export default function GovtSchemes() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FindGovtSchemesOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            location: "",
        },
    });

    const onSubmit: SubmitHandler<FindGovtSchemesInput> = async (data) => {
        setLoading(true);
        setResult(null);
        try {
            const response = await findGovtSchemes(data);
            setResult(response);
        } catch (error) {
            console.error("Error finding schemes:", error);
            toast({
                variant: "destructive",
                title: t('toasts.error'),
                description: t('toasts.govtSchemesError'),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{t('govtSchemes.title')}</CardTitle>
                <CardDescription className="text-center">{t('govtSchemes.description')}</CardDescription>
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
                                        <FormLabel>{t('govtSchemes.locationLabel')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('govtSchemes.locationPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="farmerCategory"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('govtSchemes.categoryLabel')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('govtSchemes.categoryPlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Small Farmer">{t('govtSchemes.smallFarmer')}</SelectItem>
                                            <SelectItem value="Marginal Farmer">{t('govtSchemes.marginalFarmer')}</SelectItem>
                                            <SelectItem value="Large Farmer">{t('govtSchemes.largeFarmer')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('govtSchemes.searching')}
                                </>
                            ) : (
                                t('govtSchemes.button')
                            )}
                        </Button>
                    </form>
                </Form>

                {result && result.schemes.length > 0 && (
                     <Accordion type="single" collapsible className="w-full mt-8">
                        {result.schemes.map((scheme) => (
                            <AccordionItem value={scheme.name} key={scheme.name}>
                                <AccordionTrigger className="text-base font-bold">{scheme.name}</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-primary">{t('govtSchemes.results.eligibility')}</h4>
                                        <p className="text-muted-foreground">{scheme.eligibility}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary">{t('govtSchemes.results.benefits')}</h4>
                                        <p className="text-muted-foreground">{scheme.benefits}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary">{t('govtSchemes.results.documents')}</h4>
                                        <p className="text-muted-foreground">{scheme.documents}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary">{t('govtSchemes.results.application')}</h4>
                                        <p className="text-muted-foreground">{scheme.application}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
                 {result && result.schemes.length === 0 && (
                    <div className="mt-8 text-center text-muted-foreground">
                        {t('govtSchemes.results.noSchemes')}
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
