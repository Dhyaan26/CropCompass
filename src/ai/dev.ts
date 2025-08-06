import { config } from 'dotenv';
config();

import('@/ai/flows/suggest-optimal-crops.ts');
import('@/ai/flows/calculate-irrigation-schedule.ts');
import('@/ai/flows/predict-yield.ts');
import('@/ai/flows/analyze-farm-data.ts');
import('@/ai/flows/find-govt-schemes.ts');
import('@/ai/flows/chat-assistant.ts');
import('@/ai/flows/diagnose-plant.ts');
