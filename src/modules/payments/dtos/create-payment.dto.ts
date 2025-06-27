import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  phonenumber?: string;

  @IsString()
  name?: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The amount to be charged for the payment',
    type: 'number',
    example: 10000, // Amount in naira or usd or gbp
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'The currency for the payment, e.g., NGN, USD, GBP',
    type: 'string',
    example: 'NGN',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description:
      'The redirect URL for the payment, where the user will be sent after payment',
    type: 'string',
    example: 'https://example.com/redirect',
    required: false,
  })
  @IsString()
  @IsOptional()
  redirect_url: string;

  @ApiProperty({
    description: 'Customer details for the payment',
    type: CustomerDto,
    example: {
      email: 'customer@example.com',
      phonenumber: '1234567890',
      name: 'John Doe',
    },
  })
  @IsOptional()
  customer?: CustomerDto;
}

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'The status of the payment verification from Flutterwave',
    type: 'string',
    example: 'completed',
  })
  status: string;
  @ApiProperty({
    description: 'The transaction ID of the payment to verify from Flutterwave',
    type: 'number',
    example: 9451693,
  })
  @IsNumber()
  @IsNotEmpty()
  transaction_id: number;

  @ApiProperty({
    description: 'The transaction reference for the payment',
    type: 'string',
    example: 'tx_ref=iylmibs-7185e46ed3d968bdef1ff0169d67170d',
  })
  @IsString()
  @IsNotEmpty()
  transaction_ref: string;
}
