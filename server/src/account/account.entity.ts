import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Loan } from '../loan/loan.entity';

@Entity({ name: 'accounts' })
export class Account {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  amount: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'account_number', type: 'varchar', length: 19, unique: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @ManyToOne(() => User, user => user.accounts, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @OneToMany(() => Transaction, transaction => transaction.source)
  source: Relation<Transaction[]>;

  @OneToMany(() => Transaction, transaction => transaction.destination)
  destination: Relation<Transaction[]>;

  @OneToOne(() => Loan, loan => loan.account)
  loan: Relation<Loan>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
