import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../enums/roles.enum';
import { Account } from '../account/account.entity';

@Entity({ name: 'users' })
export class User {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'avatar', type: 'simple-json' })
  avatar: {
    url: string;
    public_id: string;
  };

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ name: 'address', type: 'simple-json' })
  address: {
    state: string;
    city: string;
    country: string;
  };

  @Column({ type: 'enum', enum: Roles, default: Roles.CUSTOMER })
  role: Roles;

  @OneToMany(() => Account, account => account.user)
  accounts: Relation<Account[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
