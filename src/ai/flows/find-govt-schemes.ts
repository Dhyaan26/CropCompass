'use server';

/**
 * @fileOverview A government scheme finder AI agent.
 *
 * - findGovtSchemes - A function that finds relevant government schemes.
 * - FindGovtSchemesInput - The input type for the findGovtSchemes function.
 * - FindGovtSchemesOutput - The return type for the findGovtSchemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindGovtSchemesInputSchema = z.object({
  location: z.string().describe('The location of the user (e.g., District, State).'),
  farmerCategory: z.string().describe('The category of the farmer (e.g., Small, Marginal, Large).'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type FindGovtSchemesInput = z.infer<typeof FindGovtSchemesInputSchema>;

const SchemeSchema = z.object({
    name: z.string().describe("The name of the government scheme."),
    eligibility: z.string().describe("The eligibility criteria for the scheme."),
    benefits: z.string().describe("The benefits provided by the scheme."),
    documents: z.string().describe("The list of documents required to apply for the scheme."),
    application: z.string().describe("The application process for the scheme."),
});

const FindGovtSchemesOutputSchema = z.object({
  schemes: z.array(SchemeSchema).describe('A list of relevant government schemes.'),
});
export type FindGovtSchemesOutput = z.infer<typeof FindGovtSchemesOutputSchema>;

export async function findGovtSchemes(input: FindGovtSchemesInput): Promise<FindGovtSchemesOutput> {
  return findGovtSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findGovtSchemesPrompt',
  input: {schema: FindGovtSchemesInputSchema},
  output: {schema: FindGovtSchemesOutputSchema},
  prompt: `You are an expert advisor on Indian government schemes for farmers. Based on the user's location and farmer category, identify relevant central and state-level government schemes. Provide details for each scheme including eligibility, benefits, required documents, and the application process.

Provide the entire response in the following language: {{{language}}}.

Location: {{{location}}}
Farmer Category: {{{farmerCategory}}}

Focus on the most impactful schemes like PM-Kisan, Soil Health Card, and PMFBY, but also include others that are relevant to the user's profile.`,
});

const findGovtSchemesFlow = ai.defineFlow(
  {
    name: 'findGovtSchemesFlow',
    inputSchema: FindGovtSchemesInputSchema,
    outputSchema: FindGovtSchemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
