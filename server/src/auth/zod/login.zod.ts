import { email, object, string, infer as zInfer } from 'zod';

export const loginInputSchema = object({
  email: email({ pattern: /^[A-Za-z]{4,15}[0-9]+@gmail\.com$/, error: 'Invalid email syntax' }),
  password: string('Password is required')
    .min(8, 'Minimum length is 8 characters')
    .max(20, 'Maximum length is 20 characters'),
});

export type LoginInput = zInfer<typeof loginInputSchema>;
