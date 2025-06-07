import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('product_media')
export class ProductMedia {
  @ApiProperty({
    description: 'Unique identifier for the product media',
    type: 'number',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'URL of the product media from cloudinary or other storage',
    type: 'string',
    example: 'https://example.com/image.jpg',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: 'Type of the product media, e.g., image, video',
    type: 'string',
    example: 'image',
  })
  @Column({ default: 'image', nullable: true })
  type: string; // 'image', 'video', etc.

  @ApiProperty({
    description:
      'Position of the product media for ordering, with 1 being the main image and 2 being the second image, etc.',
    type: 'number',
    example: 0,
  })
  @Column({ default: 0 })
  position: number; // For ordering images

  @Column('uuid')
  productId: string;

  @ManyToOne(() => Product, (product) => product.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
