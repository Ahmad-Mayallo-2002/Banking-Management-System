import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer';
import { Accounts } from '../enums/accounts';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: Accounts })
  type: Accounts;

  @Column({ type: 'varchar', length: 255 })
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.accounts)
  customer: Relation<Customer>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
