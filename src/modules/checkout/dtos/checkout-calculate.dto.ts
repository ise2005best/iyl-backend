import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @ApiProperty({
    description: 'Product Variant ID',
    example: '123',
  })
  @IsNumber()
  productVariantId: number;

  @ApiProperty({
    description: 'Quantity of the product variant to be purchased',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class LocationDto {
  @ApiProperty({
    description: 'Users country code',
    example: 'NG',
  })
  @IsString()
  country: string;
}

export class CheckoutCalculateDto {
  @ApiProperty({
    description: 'Array of items to calculate',
    type: [CheckoutItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];

  @ApiProperty({
    description: 'Customer location for shipping and tax calculation',
    type: LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
