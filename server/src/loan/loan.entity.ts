import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';

@Entity({ name: 'loans' })
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Total amount for loan
  @Column({ name: 'borrowed_amount', type: 'decimal', default: 0 })
  borrowedAmount: number;

  @Column({ name: 'is_paid', type: 'boolean', default: false })
  isPaid: boolean;

  // Amount that customer pay it to pay loan
  @Column({ name: 'repaid_amount', type: 'decimal', default: 0 })
  repaidAmount: number;

  @Column({ name: 'account_id', type: 'varchar', length: 255 })
  accountId: string;

  @OneToOne(() => Account, account => account.loan, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Relation<Account>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
