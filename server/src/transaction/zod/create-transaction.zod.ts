import { infer as zInfer, object, string, enum as zEnum, float32 } from 'zod';
import { TransactionType } from '../../enums/transactions.enum';

export const transactionInputSchema = object({
  type: zEnum([
    TransactionType.DEPOSIT,
    TransactionType.LOAN_PAYMENT,
    TransactionType.TAKE_LOAN,
    TransactionType.TRANSFER,
    TransactionType.WITHDRAWAL,
  ]),
  amount: float32('Amount is required'),
  sourceNumber: string('Your account number is required').regex(
    /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/,
    'Invalid account number syntax',
  ),
  destinationNumber: string()
    .regex(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/, 'Invalid account number syntax')
    .optional(),
}).refine(
  data => {
    if (data.type === TransactionType.TRANSFER) return !!data.destinationNumber;
    return true;
  },
  {
    message: 'Destination account number is required for bank transfers',
    path: ['destinationNumber'],
  },
);

export type TransactionInput = zInfer<typeof transactionInputSchema>;
