import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { Account } from './account';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'address', type: 'simple-json' })
  address: {
    state: string;
    city: string;
    country: string;
  };

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, user => user.customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>;

  @OneToMany(() => Account, account => account.customer)
  accounts: Relation<Account[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}