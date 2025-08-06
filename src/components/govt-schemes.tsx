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


const formSchema = z.object({
  location: z.string().min(2, { message: "Location is required." }),
  farmerCategory: z.string({ required_error: "Please select a category." }),
});

export default function GovtSchemes() {
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
                title: "Error",
                description: "Failed to find government schemes. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>4. Applicable Government Schemes</CardTitle>
                <CardDescription>Enter your details to find relevant central and state government schemes.</CardDescription>
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
                                        <FormLabel>Location (e.g., District, State)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="E.g., Pune, Maharashtra" {...field} />
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
                                    <FormLabel>Farmer Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Small Farmer">Small Farmer (1-2 hectares)</SelectItem>
                                            <SelectItem value="Marginal Farmer">Marginal Farmer (less than 1 hectare)</SelectItem>
                                            <SelectItem value="Large Farmer">Large Farmer (more than 2 hectares)</SelectItem>
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
                                    Searching...
                                </>
                            ) : (
                                "Find Schemes"
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
                                        <h4 className="font-semibold text-primary">Eligibility</h4>
                                        <p className="text-muted-foreground">{scheme.eligibility}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary">Benefits</h4>
                                        <p className="text-muted-foreground">{scheme.benefits}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary">Documents Required</h4>
                                        <p className="text-muted-foreground">{scheme.documents}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-primary">How to Apply</h4>
                                        <p className="text-muted-foreground">{scheme.application}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
                 {result && result.schemes.length === 0 && (
                    <div className="mt-8 text-center text-muted-foreground">
                        No specific schemes found for the provided details. Try broadening your search.
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
