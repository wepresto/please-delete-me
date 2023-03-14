import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  // OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

// import { Loan } from '../loan/loan.entity';
// import { LoanRequest } from '../loan-request/loan-request.entity';

@Entity({ name: 'lender' })
@Unique('uk_lender_uid', ['uuid'])
export class Lender extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uuid?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // relations

  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => User, (user) => user.lender)
  user: User;
}
