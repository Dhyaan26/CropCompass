'use server';

import { optimizeCropRotation, type OptimizeCropRotationInput } from "@/ai/flows/optimize-crop-rotation";

export async function getCropRotationPlan(input: OptimizeCropRotationInput) {
    try {
        const data = await optimizeCropRotation(input);
        return { data };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Failed to get crop rotation plan.' };
    }
}
