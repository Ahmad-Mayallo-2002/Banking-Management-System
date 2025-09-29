import { any, email, object, string, infer as zInfer } from 'zod';

export const signUpInputSchema = object({
  username: string('Username is required')
    .min(5, 'Minimum length is 5 characters')
    .max(15, 'Maximum length is 15 characters'),
  email: email({ pattern: /^[A-Za-z]{4,15}[0-9]+@gmail\.com$/, error: 'Invalid email syntax' }),
  password: string('Password is required')
    .min(8, 'Minimum length is 8 characters')
    .max(20, 'Maximum length is 20 characters'),
  phone: string('Phone number is required').regex(/^\+\d{10,15}$/, 'Invalid phone number syntax'),
  address: object({
    city: string('City is required'),
    state: string('State is required'),
    country: string('Country is required'),
  }),
  avatar: any().refine(file => file && file.mimetype.startsWith('image/'), {
    message: 'Avatar file must be image file',
  }),
});

export type SignUpInput = zInfer<typeof signUpInputSchema>;
