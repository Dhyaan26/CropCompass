'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant problem.'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the image contains a plant.'),
    commonName: z.string().describe('The common name of the identified plant.'),
    latinName: z.string().describe('The Latin name of the identified plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    diseaseOrPest: z.string().describe("The name of the disease or pest affecting the plant. 'None' if healthy."),
    confidence: z.string().describe("Confidence level of the diagnosis (e.g., High, Medium, Low)."),
    description: z.string().describe('A detailed description of the disease or pest and its symptoms.'),
  }),
  treatment: z.object({
    organic: z.array(z.string()).describe('A list of organic treatment suggestions.'),
    chemical: z.array(z.string()).describe('A list of chemical treatment suggestions.'),
  }),
  prevention: z.array(z.string()).describe('A list of tips to prevent this issue in the future.'),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert plant pathologist and botanist. Your task is to analyze an image of a plant and a user-provided description to identify the plant, diagnose any diseases or pests, and recommend treatments and prevention methods.

Analyze the provided image and description.
1.  **Identification**: First, confirm if the image contains a plant. If it does, identify its common and Latin names.
2.  **Diagnosis**: Determine if the plant is healthy. If not, identify the disease or pest. State your confidence in this diagnosis. Provide a detailed description of the symptoms and the identified issue.
3.  **Treatment**: Suggest specific organic and chemical treatment methods.
4.  **Prevention**: Provide actionable tips to prevent the problem from recurring.

User's Description: {{{description}}}
Plant Photo: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
