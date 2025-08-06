'use server';
/**
 * @fileOverview This file defines a Genkit flow for calculating an irrigation schedule based on crop type, soil conditions, and weather forecasts.
 *
 * - calculateIrrigationSchedule - A function that calculates the irrigation schedule.
 * - CalculateIrrigationScheduleInput - The input type for the calculateIrrigationSchedule function.
 * - CalculateIrrigationScheduleOutput - The return type for the calculateIrrigationSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateIrrigationScheduleInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown.'),
  soilType: z.string().describe('The type of soil the crop is grown in.'),
  location: z.string().describe('The location where the crop is being grown.'),
  waterAccess: z.string().describe('Water access description'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type CalculateIrrigationScheduleInput = z.infer<typeof CalculateIrrigationScheduleInputSchema>;

const CalculateIrrigationScheduleOutputSchema = z.object({
  irrigationSchedule: z.string().describe('The recommended irrigation schedule.'),
  waterConservationTips: z.string().describe('Tips for water conservation.'),
});
export type CalculateIrrigationScheduleOutput = z.infer<typeof CalculateIrrigationScheduleOutputSchema>;

export async function calculateIrrigationSchedule(input: CalculateIrrigationScheduleInput): Promise<CalculateIrrigationScheduleOutput> {
  return calculateIrrigationScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateIrrigationSchedulePrompt',
  input: {schema: CalculateIrrigationScheduleInputSchema},
  output: {schema: CalculateIrrigationScheduleOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in irrigation. Based on the crop type, soil conditions, location, and weather forecasts, create an irrigation schedule.  Also suggest water conservation techniques.

Provide the entire response in the following language: {{{language}}}.

Crop Type: {{{cropType}}}
Soil Type: {{{soilType}}}
Location: {{{location}}}
Water access: {{{waterAccess}}}`,
});

const calculateIrrigationScheduleFlow = ai.defineFlow(
  {
    name: 'calculateIrrigationScheduleFlow',
    inputSchema: CalculateIrrigationScheduleInputSchema,
    outputSchema: CalculateIrrigationScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
