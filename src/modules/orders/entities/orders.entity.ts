import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
}
export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
}

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'Unique identifier for the order',
    type: 'string',
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({
    description: 'Current status of the order',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment status of the order',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;
  @ApiProperty({
    description: 'Total amount before tax and shipping',
    type: 'number',
    example: 150.0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
  @ApiProperty({
    description: 'Tax percentage applied to the order',
    type: 'number',
    example: 7.5,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0, nullable: true })
  taxPercentage: number;

  @ApiProperty({
    description: 'Tax amount',
    type: 'number',
    example: 12000.0,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0, nullable: true })
  taxAmount: number;
  @ApiProperty({
    description: 'Shipping type',
    type: 'string',
    example: 'Within Lagos',
  })
  @Column()
  shippingType: string;
  @ApiProperty({
    description: 'Shipping cost',
    type: 'number',
    example: 5.0,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingAmount: number;

  @ApiProperty({
    description: 'Final total amount paid',
    type: 'number',
    example: 152.0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  orderTotal: number;

  @ApiProperty({
    description: 'Currency code for the order',
    type: 'string',
    example: 'NGN',
  })
  @Column({ default: 'NGN' })
  currency: string;

  @ApiProperty({
    description: 'Customer information',
    example: {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+2348123456789',
    },
  })
  @Column({ type: 'jsonb' })
  customerDetails: {
    email: string;
    name: string;
    phone: string;
  };

  @ApiProperty({
    description: 'Product information for quick reference',
    example: {
      items: [
        {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          variantId: 4,
          productName: 'AGAVE Red Sweat Pants',
          variantName: 'S',
          unitPrice: 60000,
          lineTotal: 120000,
          quantity: 2,
          image: 'https://example.com/image.jpg', // image from cloudinary
        },
      ],
    },
  })
  @Column({ type: 'jsonb' })
  productDetails: {
    items: Array<{
      productId: string;
      variantId: number;
      productName: string;
      variantName: string;
      unitPrice: number;
      lineTotal: number;
      quantity: number;
      image?: string;
    }>;
  };
  @ApiProperty({
    description: 'Shipping address information',
    example: {
      address: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos State',
      postalCode: '100001',
      country: 'Nigeria',
    },
  })
  @Column({ type: 'jsonb' })
  shippingDetails: {
    address: string;
    city?: string;
    state: string;
    postalCode?: string;
    country: string;
  };

  @ApiProperty({
    description: 'Tracking number for shipped orders',
    type: 'string',
    required: false,
  })
  @Column({ nullable: true })
  trackingNumber?: string;

  @ApiProperty({
    description: 'When the order was created',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the order was last updated',
    type: 'string',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
