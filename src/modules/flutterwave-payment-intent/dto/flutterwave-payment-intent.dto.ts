import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'The amount to be charged for the payment',
    type: 'number',
    example: 10000, // Amount in naira or usd or gbp
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @ApiProperty({
    description: 'The currency for the payment, e.g., NGN, USD, GBP',
    type: 'string',
    example: 'NGN',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
