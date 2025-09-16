import { z } from 'zod';

// Zod schema for user input
export const userInputSchema = z.object({
  username: z
    .string('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must not exceed 30 characters'),
  email: z.email({ error: 'Invalid email syntax', pattern: /^[A-Za-z]{5,20}[0-9]*@gmail\.com$/ }),
  password: z.string('Password is required').min(6, 'Password must be at least 6 characters long'),
  phone: z.string('Phone number is required').regex(/^[0-9]{10,15}$/, 'Phone must be 10–15 digits'),
  address: z.object({
    city: z.string('City is required').min(2, 'City name is too short'),
    state: z.string('State is required').min(2, 'State name is too short'),
    country: z.string('Country is required').min(2, 'Country name is too short'),
  }),
  // For avatar, since it's a file, you can validate it as unknown and refine
  avatar: z.any().refine(file => file && file.mimetype?.startsWith('image/'), {
    message: 'Avatar must be an image file',
  }),
});

// Infer TypeScript type from schema (optional, keeps in sync with validation)
export type UserInput = z.infer<typeof userInputSchema>;

export const loginInput = z.object({
  email: z.email({ error: 'Invalid email syntax', pattern: /^[A-Za-z]{5,20}[0-9]*@gmail\.com$/ }),
  password: z.string('Password is required').min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof loginInput>;