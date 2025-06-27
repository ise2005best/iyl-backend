import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum VariantSize {
  XXS = 'xxs',
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
  XXXL = '3xl',
}

@Entity('product_variants')
export class ProductVariant {
  @ApiProperty({
    description: 'Unique identifier for the product variant',
    type: 'string',
    example: 123,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Size of the product variant',
    enum: VariantSize,
    example: VariantSize.MD,
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Price of the product variant',
    type: 'number',
    example: 9000.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Quantity of the product variant in stock',
    type: 'number',
    example: 10,
  })
  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;
}
