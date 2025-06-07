import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Variant size',
    example: 'sm',
    enum: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    type: 'string',
  })
  title: string;
  @ApiProperty({
    description: 'Variant price usually the same as the product price',
    example: 25000.0,
    type: 'number',
  })
  price: number;
  @ApiProperty({
    description: 'Available quantity of the variant in stock',
    type: 'number',
    example: 10,
  })
  quantity: number;
}

export class ProductMediaDto {
  @ApiProperty({
    description: 'Media ID',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'Media URL from cloudinary',
    example: 'https://example.com/image.jpg',
  })
  url: string;
  @ApiProperty({
    description: 'Media type',
    example: 'image',
    default: 'image',
  })
  type: string;
  @ApiProperty({
    description: 'Media position for ordering',
    example: 0,
  })
  position: number;
}

export class ProductMetafieldDto {
  @ApiProperty({
    description: 'Metafield key',
    example: 'size_guide',
    enum: ['size_guide', 'model_height', 'model_size'],
  })
  key: string;
  @ApiProperty({
    description: 'Metafield value',
    example: 'M',
  })
  value: string;
}

export class ContextualPriceDto {
  @ApiProperty({
    description: 'Price amount',
    example: 25000.0,
    type: 'number',
  })
  amount: number;
  @ApiProperty({
    description: 'Currency code',
    example: 'NGN',
    enum: ['NGN', 'GBP', 'USD'],
  })
  currencyCode: string;
  @ApiProperty({
    description: 'Country code',
    example: 'NG',
    enum: ['NG', 'GB', 'US'],
  })
  country: string;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'Product title',
    example: 'Classic White T-Shirt',
  })
  title: string;
  @ApiProperty({
    description: 'Product description',
    example: 'A comfortable and stylish white t-shirt made from 100% cotton.',
  })
  description: string;
  @ApiProperty({
    description: 'Total inventory across all variants',
    example: 50,
  })
  totalInventory: number;
  @ApiProperty({
    description: 'Product variants',
    type: [ProductVariantDto],
  })
  variants: ProductVariantDto[];
  @ApiProperty({
    description: 'Product media/images',
    type: [ProductMediaDto],
  })
  media: ProductMediaDto[];
  @ApiProperty({
    description: 'Product metafields',
    type: [ProductMetafieldDto],
  })
  metafields: ProductMetafieldDto[];
  @ApiProperty({
    description: 'Contextual pricing for different countries',
    type: [ContextualPriceDto],
  })
  contextualPricing: ContextualPriceDto[];
}
