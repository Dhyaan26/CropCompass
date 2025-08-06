
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getMarketPrice,
  type GetMarketPriceInput,
  type GetMarketPriceOutput,
} from "@/ai/flows/get-market-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, IndianRupee, TrendingUp, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const formSchema = z.object({
  productName: z.string().min(2, { message: "Product name is required." }),
  location: z.string().min(2, { message: "Location is required." }),
});

export default function MarketPrice() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GetMarketPriceOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      location: "",
    },
  });

  const onSubmit: SubmitHandler<GetMarketPriceInput> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await getMarketPrice(data);
      setResult(response);
    } catch (error) {
      console.error("Error getting market price:", error);
      toast({
        variant: "destructive",
        title: t('toasts.error'),
        description: t('toasts.marketPriceError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t('marketPrice.title')}</CardTitle>
        <CardDescription className="text-center">{t('marketPrice.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('marketPrice.productNameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('marketPrice.productNamePlaceholder')} {...field} />
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
                    <FormLabel>{t('marketPrice.locationLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('marketPrice.locationPlaceholder')} {...field} />
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
                  {t('marketPrice.gettingPrice')}
                </>
              ) : (
                t('marketPrice.button')
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <IndianRupee className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('marketPrice.results.averagePrice')} for {result.productName}</CardTitle>
                  <CardDescription>{result.averagePrice}</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <TrendingUp className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('marketPrice.results.marketTrends')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.marketTrends}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{t('marketPrice.results.priceFactors')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.priceFactors}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
