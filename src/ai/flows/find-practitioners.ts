'use server';
/**
 * @fileOverview Finds medical practitioners based on a location query.
 *
 * - findPractitioners - A function that takes a location query and returns a list of nearby practitioners.
 * - FindPractitionersInput - The input type for the findPractitioners function.
 * - FindPractitionersOutput - The return type for the findPractitioners function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindPractitionersInputSchema = z.object({
  locationQuery: z
    .string()
    .describe(
      'The location to search for practitioners, e.g., "Dublin", "Cork, Ireland", "Eircode D02 F205", or "my current location".'
    ),
});
export type FindPractitionersInput = z.infer<typeof FindPractitionersInputSchema>;

const PractitionerSchema = z.object({
  name: z.string().describe('The name of the practitioner or clinic.'),
  specialty: z.string().describe('The medical specialty of the practitioner.'),
  address: z.string().describe('The full address of the clinic.'),
  phone: z.string().describe('The contact phone number.'),
  isHospital: z.boolean().describe('Whether the practitioner is a hospital or a large clinic.')
});

const FindPractitionersOutputSchema = z.object({
  practitioners: z
    .array(PractitionerSchema)
    .describe('A list of medical practitioners found near the specified location.'),
});
export type FindPractitionersOutput = z.infer<typeof FindPractitionersOutputSchema>;

export async function findPractitioners(
  input: FindPractitionersInput
): Promise<FindPractitionersOutput> {
  return findPractitionersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findPractitionersPrompt',
  input: {schema: FindPractitionersInputSchema},
  output: {schema: FindPractitionersOutputSchema},
  prompt: `You are an expert directory assistant for a health application in Ireland.
Your task is to generate a list of 5 to 7 realistic but fictional medical practitioners, clinics, or hospitals based on the user's provided location.

For each practitioner, you must provide:
- A realistic name (e.g., "The Grand Canal Clinic", "Dr. Siobhan Reilly", "Cork University Hospital").
- A relevant specialty (e.g., "General Practitioner", "Cardiology", "Emergency & General Hospital").
- A plausible, location-specific address in Ireland.
- A fictional but correctly formatted Irish phone number.
- A boolean 'isHospital' flag, set to true only for large hospitals.

The user's location is: {{{locationQuery}}}

Generate the list of practitioners now.`,
});

const findPractitionersFlow = ai.defineFlow(
  {
    name: 'findPractitionersFlow',
    inputSchema: FindPractitionersInputSchema,
    outputSchema: FindPractitionersOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
