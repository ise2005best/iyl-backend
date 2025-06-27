import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_intents')
export class PaymentIntent {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  txRef: string; // Transaction reference from Flutterwave

  @Column('decimal', { precision: 10, scale: 2 })
  expectedAmount: number;

  @Column()
  expectedCurrency: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  flutterwaveTransactionId: number;

  @Column()
  orderNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
