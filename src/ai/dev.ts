import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-optimal-crops.ts';
import '@/ai/flows/calculate-irrigation-schedule.ts';