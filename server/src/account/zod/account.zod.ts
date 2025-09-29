import { infer as zInfer, object, string } from 'zod';

export const accountInputSchema = object({
  password: string('Account password is required')
    .length(4, 'Password length is 4 characters')
    .regex(/\d{4}/, 'Invalid password syntax'),
  accountNumber: string('Account number is required')
    .length(19, 'Account number is 19 characters')
    .regex(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/, 'Invalid password syntax'),
});

export type AccountInput = zInfer<typeof accountInputSchema>;
