'use server';
/**
 * @fileOverview A farm data analysis AI agent.
 *
 * - analyzeFarmData - A function that handles the farm data analysis process.
 * - AnalyzeFarmDataInput - The input type for the analyzeFarmData function.
 * - AnalyzeFarmDataOutput - The return type for the analyzeFarmData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFarmDataInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A data file (CSV, XLS, PDF), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the uploaded file.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type AnalyzeFarmDataInput = z.infer<typeof AnalyzeFarmDataInputSchema>;

const AnalyzeFarmDataOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the farm data, including insights on yields, costs, and risks.'),
});
export type AnalyzeFarmDataOutput = z.infer<typeof AnalyzeFarmDataOutputSchema>;

export async function analyzeFarmData(input: AnalyzeFarmDataInput): Promise<AnalyzeFarmDataOutput> {
  return analyzeFarmDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFarmDataPrompt',
  input: {schema: AnalyzeFarmDataInputSchema},
  output: {schema: AnalyzeFarmDataOutputSchema},
  prompt: `You are an expert agricultural data analyst. Analyze the following farm data from the file '{{{fileName}}}' and provide a detailed analysis. Focus on providing actionable insights regarding crop yields, operational costs, and potential risks.

Provide the entire response in the following language: {{{language}}}.

Use the following data as the source for your analysis.

File: {{media url=fileDataUri}}`,
});

const analyzeFarmDataFlow = ai.defineFlow(
  {
    name: 'analyzeFarmDataFlow',
    inputSchema: AnalyzeFarmDataInputSchema,
    outputSchema: AnalyzeFarmDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
