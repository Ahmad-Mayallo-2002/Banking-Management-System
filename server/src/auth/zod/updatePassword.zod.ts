import { infer as zInfer, object, string } from 'zod';

export const updatePasswordInputSchema = object({
  newPassword: string('New password is required')
    .min(8, 'Minimum length is 8 characters')
    .max(20, 'Maximum length is 20 characters'),
  confirmNewPassword: string('Confirm password is required')
    .min(8, 'Minimum length is 8 characters')
    .max(20, 'Maximum length is 20 characters'),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: 'Passwords must match',
});

export type UpdatePasswordInput = zInfer<typeof updatePasswordInputSchema>;
