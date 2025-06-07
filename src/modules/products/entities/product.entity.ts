import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductVariant } from './product-variant.entity';
import { ProductMedia } from './product-media.entity';
import { ProductMetafield } from './product-metafield.entity';
import { ContextualPrice } from './contextual-price.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Title of the product',
    example: 'Sample Product',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a sample product.',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Total inventory of the product',
    example: 100,
  })
  @Column({ default: 0 })
  totalInventory: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductMetafield, (metafield) => metafield.product, {
    cascade: true,
  })
  metafields: ProductMetafield[];

  @OneToMany(() => ContextualPrice, (price) => price.product, { cascade: true })
  contextualPricing: ContextualPrice[];

  @OneToMany(() => ProductMedia, (media) => media.product, { cascade: true })
  media: ProductMedia[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
