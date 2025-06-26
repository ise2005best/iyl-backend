import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum MetafieldKey {
  SIZE_GUIDE = 'size_guide',
  MODEL_HEIGHT = 'model_height',
  MODEL_SIZE = 'model_size',
}

@Entity('product_metafields')
export class ProductMetafield {
  @ApiProperty({
    description: 'Unique identifier for the product metafield',
    type: 'number',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:
      'Key for the metafield, e.g., size_guide, model_height, model_size',
    enum: MetafieldKey,
    example: MetafieldKey.SIZE_GUIDE,
    type: 'string',
  })
  @Column()
  key: string; // Changed from enum to string

  @ApiProperty({
    description:
      'Value of the metafield, can be text or url for size guide images',
    type: 'string',
    example: 'https://example.com/size-guide.pdf',
  })
  @Column('text')
  value: string;

  @Column({ type: 'varchar' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.metafields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
