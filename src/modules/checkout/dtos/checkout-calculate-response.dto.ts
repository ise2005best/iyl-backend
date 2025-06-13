import { ApiProperty } from '@nestjs/swagger';

interface ShippingMethod {
  name: string;
  currency: string;
  cost: number;
  description?: string;
  estimatedDelivery: string;
}

export class MoneyDto {
  @ApiProperty({
    example: 5000,
  })
  amount: number;

  @ApiProperty({
    example: 'NGN',
  })
  currency: string;
}

export class ProductDto {
  @ApiProperty({
    example: 'Agave Red Sweats',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'M',
    description: 'Product variant (e.g., size, color)',
  })
  variant: string;

  @ApiProperty({
    example: 4000,
    description: 'Unit price of the product',
  })
  unitPrice: number;

  @ApiProperty({
    example: 'NGN',
    description: 'Currency of the product price',
  })
  currency: string;

  @ApiProperty({
    example: 8000,
    description: 'Total price for all quantities (unitPrice × quantity)',
  })
  totalPrice: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
  })
  quantity: number;
}

export class TaxBreakdownDto {
  @ApiProperty({ example: 3750 })
  amount: number;

  @ApiProperty({ example: 0.075 })
  rate: number;

  @ApiProperty({ example: 'NGN' })
  currency: string;
}

export class ShippingOptionsDto {
  @ApiProperty({ example: 'Within Lagos' })
  zone: string;

  @ApiProperty({ example: 2000 })
  zoneName: string;

  @ApiProperty({ example: 'states in nigera' })
  states: string[];

  shippingMethod: ShippingMethod;
}

export class OrderTotalDto {
  @ApiProperty({
    example: 55750,
    description: 'This is the orders subtotal including shipping and tax',
  })
  subtotal: number;

  @ApiProperty({ example: 'NGN' })
  currency: string;
}

export class CheckoutCalculateResponseDto {
  @ApiProperty({
    type: MoneyDto,
    description: 'This is the total of the product variant price x quantity',
  })
  total: MoneyDto;

  @ApiProperty({
    type: TaxBreakdownDto,
    description:
      'This is the tax breakdown the amount(calculated) the rate and the currency it is calculated in',
  })
  tax: TaxBreakdownDto;

  @ApiProperty({
    type: [ShippingOptionsDto],
  })
  shippingOptions: ShippingOptionsDto[];

  @ApiProperty({
    type: [ProductDto],
  })
  products: ProductDto[];
}
