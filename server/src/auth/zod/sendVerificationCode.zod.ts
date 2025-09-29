import { email, infer as zInfer, object } from 'zod';

export const emailInputSchema = object({
  email: email({ pattern: /^[A-Za-z]{4,15}[0-9]+@gmail\.com$/, error: 'Invalid email syntax' }),
});

export type EmailInput = zInfer<typeof emailInputSchema>;
