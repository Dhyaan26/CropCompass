'use server';
/**
 * @fileOverview A crop rotation optimization AI agent.
 *
 * - optimizeCropRotation - A function that handles the crop rotation optimization process.
 * - OptimizeCropRotationInput - The input type for the optimizeCropRotation function.
 * - OptimizeCropRotationOutput - The return type for the optimizeCropRotation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCropRotationInputSchema = z.object({
  location: z.string().describe('The location of the farm.'),
  soilType: z.string().describe('The type of soil on the farm.'),
  previousCrop: z.string().describe('The crop that was previously grown on the farm.'),
});
export type OptimizeCropRotationInput = z.infer<typeof OptimizeCropRotationInputSchema>;

const OptimizeCropRotationOutputSchema = z.object({
    rotation: z.array(z.object({
        season: z.string().describe("The season for this crop (e.g., Kharif, Rabi, Zaid)."),
        crop: z.string().describe("The recommended crop for this season."),
        reasoning: z.string().describe("The reasoning for recommending this crop in this season."),
    })).describe("An array of crop rotation recommendations for 3 seasons."),
});
export type OptimizeCropRotationOutput = z.infer<typeof OptimizeCropRotationOutputSchema>;

export async function optimizeCropRotation(input: OptimizeCropRotationInput): Promise<OptimizeCropRotationOutput> {
  return optimizeCropRotationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCropRotationPrompt',
  input: {schema: OptimizeCropRotationInputSchema},
  output: {schema: OptimizeCropRotationOutputSchema},
  prompt: `You are an expert agricultural advisor. Your task is to recommend an ideal 3-season crop rotation sequence.

Consider the following factors:
- Soil health and nutrient management (e.g., nitrogen-fixing legumes).
- Pest and disease cycles.
- Water requirements and availability.
- Market demand and profitability for the suggested crops in the given location.
- Overall sustainability of the rotation.

Farm Details:
Location: {{{location}}}
Soil Type: {{{soilType}}}
Previous Crop: {{{previousCrop}}}

Provide a 3-season rotation plan. For each season, specify the crop and a brief reasoning for its inclusion in the rotation.
`,
});

const optimizeCropRotationFlow = ai.defineFlow(
  {
    name: 'optimizeCropRotationFlow',
    inputSchema: OptimizeCropRotationInputSchema,
    outputSchema: OptimizeCropRotationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
