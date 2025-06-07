import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({
    description: 'Variant title',
    example: 'Small',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Variant price',
    example: 25000.0,
    type: 'number',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Available quantity',
    example: 10,
  })
  @IsNumber()
  quantity: number;
}

export class CreateMediaDto {
  @ApiProperty({
    description: 'Media URL from cloudinary',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Media type',
    example: 'image',
    default: 'image',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Media position for ordering',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}

export class CreateMetafieldDto {
  @ApiProperty({
    description: 'Metafield key',
    example: 'size_guide',
    enum: ['size_guide', 'model_height', 'model_size'],
  })
  @IsIn(['size_guide', 'model_height', 'model_size'])
  key: string;

  @ApiProperty({
    description: 'Metafield value',
    example: 'M',
  })
  @IsString()
  value: string;
}

export class CreateContextualPriceDto {
  @ApiProperty({
    description: 'Price amount',
    example: 25000.0,
    type: 'number',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'NGN',
    enum: ['NGN', 'GBP', 'USD'],
  })
  @IsIn(['NGN', 'GBP', 'USD'])
  currencyCode: string;

  @ApiProperty({
    description: 'Country code',
    example: 'NG',
    enum: ['NG', 'GB', 'US'],
  })
  @IsIn(['NG', 'GB', 'US'])
  country: string;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Classic White T-Shirt',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Product description',
    example: 'A comfortable and stylish white t-shirt made from 100% cotton.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Total inventory across all variants',
    example: 50,
  })
  @IsNumber()
  totalInventory: number;

  @ApiProperty({
    description: 'Product variants (sizes and quantities)',
    type: [CreateVariantDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @ApiProperty({
    description: 'Product media/images',
    type: [CreateMediaDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  @IsOptional()
  media?: CreateMediaDto[];

  @ApiProperty({
    description: 'Product metafields (size guide, model info)',
    type: [CreateMetafieldDto],
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMetafieldDto)
  @IsOptional()
  metafields?: CreateMetafieldDto[];

  @ApiProperty({
    description: 'Contextual pricing for different countries',
    type: [CreateContextualPriceDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateContextualPriceDto)
  contextualPricing: CreateContextualPriceDto[];
}
