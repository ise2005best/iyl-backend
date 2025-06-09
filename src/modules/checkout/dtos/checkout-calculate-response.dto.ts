import { ApiProperty } from '@nestjs/swagger';

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

export class TaxBreakdownDto {
  @ApiProperty({ example: 3750 })
  amount: number;

  @ApiProperty({ example: 0.075 })
  rate: number;

  @ApiProperty({ example: 'NGN' })
  currency: string;
}

export class ShippingOptionsDto {
  @ApiProperty({ example: 'standard' })
  method: string;

  @ApiProperty({ example: 2000 })
  cost: number;

  @ApiProperty({ example: 'NGN' })
  currency: string;

  @ApiProperty({ example: 'Standard delivery within Lagos' })
  description: string;
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
    type: OrderTotalDto,
  })
  totals: OrderTotalDto;

  @ApiProperty({ example: 'within_lagos' })
  zone: string;
}
