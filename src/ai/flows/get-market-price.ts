'use server';
/**
 * @fileOverview An AI agent for getting market prices of agricultural products.
 *
 * - getMarketPrice - A function that handles the market price query.
 * - GetMarketPriceInput - The input type for the getMarketPrice function.
 * - GetMarketPriceOutput - The return type for the getMarketPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMarketPriceInputSchema = z.object({
  productName: z.string().describe('The name of the agricultural product.'),
  location: z.string().describe('The location (e.g., city, state) to get the price for.'),
});
export type GetMarketPriceInput = z.infer<typeof GetMarketPriceInputSchema>;

const GetMarketPriceOutputSchema = z.object({
  productName: z.string().describe("The name of the product."),
  location: z.string().describe("The location for which the price is relevant."),
  averagePrice: z.string().describe('The estimated average price of the product in the given location (e.g., "₹2,500 - ₹2,800 per quintal").'),
  marketTrends: z.string().describe('A brief analysis of the current market trends for this product.'),
  priceFactors: z.string().describe('Key factors influencing the price (e.g., demand, supply, weather).')
});
export type GetMarketPriceOutput = z.infer<typeof GetMarketPriceOutputSchema>;

export async function getMarketPrice(input: GetMarketPriceInput): Promise<GetMarketPriceOutput> {
  return getMarketPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMarketPricePrompt',
  input: {schema: GetMarketPriceInputSchema},
  output: {schema: GetMarketPriceOutputSchema},
  prompt: `You are an expert agricultural market analyst specializing in Indian markets. Your task is to provide a real-time market price for a given product in a specific location by referencing data from the local Agricultural Produce Market Committee (APMC).

Based on the user's query, provide the following information:
1.  **Average Price**: A real-time average price range for the product in the specified APMC location, in Indian Rupees (₹). Please provide this as a range per quintal (e.g., "₹2,500 - ₹2,800 per quintal").
2.  **Market Trends**: A brief analysis of current market trends (e.g., "Prices are currently stable but expected to rise next month due to festival demand.").
3.  **Price Factors**: Key factors currently influencing the price.

Product: {{{productName}}}
Location: {{{location}}}

Provide a realistic price estimate based on the most recent, real-time data from the relevant APMC and your knowledge of Indian agricultural markets.`,
});

const getMarketPriceFlow = ai.defineFlow(
  {
    name: 'getMarketPriceFlow',
    inputSchema: GetMarketPriceInputSchema,
    outputSchema: GetMarketPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
