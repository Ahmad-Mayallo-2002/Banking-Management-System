import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus, TransactionType } from '../enums/transactions.enum';
import { Account } from './account.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source_id: string;

  @ManyToOne(() => Account, account => account.source, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  source: Relation<Account>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  destination_id: string;

  @ManyToOne(() => Account, account => account.destination, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  destination: Relation<Account>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
