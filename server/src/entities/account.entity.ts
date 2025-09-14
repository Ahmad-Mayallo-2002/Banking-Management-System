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
import { Transaction } from './transaction.entity';
import { Loan } from './loan.entity';
import { User } from './user.entity';

@Entity({ name: 'accounts' })
export class Account {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  amount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;

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
