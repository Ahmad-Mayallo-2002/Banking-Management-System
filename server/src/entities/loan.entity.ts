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
import { Account } from './account.entity';

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

  @Column({ type: 'varchar', length: 255 })
  account_id: string;

  @OneToOne(() => Account, account => account.loan, { onDelete: 'CASCADE' })
  @JoinColumn()
  account: Relation<Account>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
