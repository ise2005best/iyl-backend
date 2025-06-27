import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';
export enum CurrencyCode {
  NGN = 'NGN',
  GBP = 'GBP',
  USD = 'USD',
}

export enum CountryCode {
  NG = 'NG',
  GB = 'GB',
  US = 'US',
}

@Entity('contextual_prices')
export class ContextualPrice {
  @ApiProperty({
    description: 'Unique identifier for the contextual price',
    type: 'number',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Price amount of the product in the specified currency',
    type: 'number',
    example: 100.0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Currency code for the price, must be one of:, NGN, GBP, USD',
    enum: CurrencyCode,
    example: CurrencyCode.NGN,
    type: 'string',
  })
  @Column()
  currencyCode: string;

  @ApiProperty({
    description: 'Country code for the price, must be one of:, NG, GB, US',
    enum: CountryCode,
    example: CountryCode.NG,
    type: 'string',
  })
  @Column()
  country: string;

  @Column('uuid')
  productId: string;

  @ManyToOne(() => Product, (product) => product.contextualPricing, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
