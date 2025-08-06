'use server';

/**
 * @fileOverview A crop recommendation AI agent.
 *
 * - suggestOptimalCrops - A function that handles the crop recommendation process.
 * - SuggestOptimalCropsInput - The input type for the suggestOptimalCrops function.
 * - SuggestOptimalCropsOutput - The return type for the suggestOptimalCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalCropsInputSchema = z.object({
  location: z.string().describe('The location of the farm.'),
  soilType: z.string().describe('The type of soil on the farm.'),
  resources: z.string().describe('The available resources for the farm.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type SuggestOptimalCropsInput = z.infer<typeof SuggestOptimalCropsInputSchema>;

const SuggestOptimalCropsOutputSchema = z.object({
  crops: z.array(z.string()).describe('The recommended crops for the farm.'),
  reasoning: z.string().describe('The reasoning behind the crop recommendations.'),
});
export type SuggestOptimalCropsOutput = z.infer<typeof SuggestOptimalCropsOutputSchema>;

export async function suggestOptimalCrops(input: SuggestOptimalCropsInput): Promise<SuggestOptimalCropsOutput> {
  return suggestOptimalCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalCropsPrompt',
  input: {schema: SuggestOptimalCropsInputSchema},
  output: {schema: SuggestOptimalCropsOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in recommending crops for farms.

You will use the following information about the farm to recommend the optimal crops to plant.

Location: {{{location}}}
Soil Type: {{{soilType}}}
Resources: {{{resources}}}

Based on this information, recommend the optimal crops to plant and provide a reasoning for your recommendations.

Provide the entire response in the following language: {{{language}}}.

Format your response as follows:

Crops: [crop1, crop2, crop3]
Reasoning: The reasoning behind the crop recommendations.`,
});

const suggestOptimalCropsFlow = ai.defineFlow(
  {
    name: 'suggestOptimalCropsFlow',
    inputSchema: SuggestOptimalCropsInputSchema,
    outputSchema: SuggestOptimalCropsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
