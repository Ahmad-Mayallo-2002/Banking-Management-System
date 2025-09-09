import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer';
import { Transaction } from './transaction';
import { Loan } from './loan';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  amount: number;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255 })
  customer_id: string;

  @ManyToOne(() => Customer, customer => customer.accounts, { onDelete: 'CASCADE' })
  customer: Relation<Customer>;

  @OneToMany(() => Transaction, transaction => transaction.source)
  source: Relation<Transaction[]>;

  @OneToMany(() => Transaction, transaction => transaction.destination)
  destination: Relation<Transaction[]>;

  @OneToMany(() => Loan, loan => loan.account)
  loans: Relation<Loan[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
