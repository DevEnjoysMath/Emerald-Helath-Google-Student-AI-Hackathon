'use server';
/**
 * @fileOverview Finds medical practitioners based on a location query.
 * This version removes Genkit dependency and returns deterministic, realistic mock data
 * suitable for production builds and demos.
 */

import { z } from 'zod';

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
  const location = (input.locationQuery || 'Ireland').toLowerCase();

  // Minimal deterministic dataset keyed by common Irish locations
  const datasets: Record<string, FindPractitionersOutput['practitioners']> = {
    dublin: [
      {
        name: 'Grand Canal Medical Clinic',
        specialty: 'General Practitioner',
        address: '21 Grand Canal Street Upper, Dublin 4, D04',
        phone: '+353 1 555 2143',
        isHospital: false,
      },
      {
        name: 'St. Stephen\'s Green Family Practice',
        specialty: 'General Practitioner',
        address: '8 Harcourt Street, Dublin 2, D02',
        phone: '+353 1 555 0087',
        isHospital: false,
      },
      {
        name: 'Dublin City Cardiology Centre',
        specialty: 'Cardiology',
        address: '45 Gardiner Street Upper, Dublin 1, D01',
        phone: '+353 1 555 7321',
        isHospital: false,
      },
      {
        name: 'Mater Misericordiae University Hospital',
        specialty: 'Emergency & General Hospital',
        address: 'Eccles St, Phibsborough, Dublin 7, D07',
        phone: '+353 1 803 2000',
        isHospital: true,
      },
    ],
    cork: [
      {
        name: 'Lee Side Family Practice',
        specialty: 'General Practitioner',
        address: '14 Washington Street, Cork City, T12',
        phone: '+353 21 555 6612',
        isHospital: false,
      },
      {
        name: 'Cork Women\'s Health Clinic',
        specialty: 'Women\'s Health',
        address: '3 Patrick\'s Quay, Cork City, T12',
        phone: '+353 21 555 7741',
        isHospital: false,
      },
      {
        name: 'Cork University Hospital',
        specialty: 'Emergency & General Hospital',
        address: 'Wilton, Cork, T12',
        phone: '+353 21 492 2000',
        isHospital: true,
      },
    ],
    galway: [
      {
        name: 'Eyre Square Medical Practice',
        specialty: 'General Practitioner',
        address: '12 Eyre Square, Galway, H91',
        phone: '+353 91 555 1020',
        isHospital: false,
      },
      {
        name: 'Galway Respiratory Clinic',
        specialty: 'Respiratory Medicine',
        address: 'College Rd, Galway, H91',
        phone: '+353 91 555 3344',
        isHospital: false,
      },
      {
        name: 'University Hospital Galway',
        specialty: 'Emergency & General Hospital',
        address: 'Newcastle Rd, Galway, H91',
        phone: '+353 91 544 544',
        isHospital: true,
      },
    ],
  };

  const pick = () => {
    if (location.includes('dublin')) return datasets.dublin;
    if (location.includes('cork')) return datasets.cork;
    if (location.includes('galway')) return datasets.galway;
    // Default mixed sample
    return [
      datasets.dublin[0],
      datasets.cork[0],
      datasets.galway[0],
      datasets.dublin[2],
      datasets.cork[2],
    ];
  };

  const practitioners = pick();
  return { practitioners };
}
