import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/detect-severity.ts';
import '@/ai/flows/find-practitioners.ts';
