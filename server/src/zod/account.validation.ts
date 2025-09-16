import z from 'zod';

export const accountInputSchema = z.object({
  account_number: z
    .string('Account number is required')
    .length(19, 'Account number length must be 19 characters')
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid account number'),
  password: z
    .string('Account password is required')
    .length(4, 'Account password must be 4 characters')
    .regex(/^\d{4}$/, 'Invalid account password syntax'),
});

export type AccountInput = z.infer<typeof accountInputSchema>;
