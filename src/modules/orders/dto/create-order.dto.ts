import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentStatus } from '../entities/orders.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerInfoDto {
  @ApiProperty({
    description: 'Customer first name',
    type: 'string',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    type: 'string',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Customer email address',
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    type: 'string',
    example: '+2348123456789',
  })
  @IsString()
  phone: string;
}

export class ProductInformationDto {
  @ApiProperty({
    description: 'Product unique identifier',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product variant unique identifier',
    type: 'number',
    example: 4,
  })
  @IsNumber()
  variantId: number;

  @ApiProperty({
    description: 'Product name',
    type: 'string',
    example: 'AGAVE Red Sweat Pants',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'Product variant name',
    type: 'string',
    example: 'S',
  })
  @IsString()
  variantName: string;

  @ApiProperty({
    description: 'Unit price per item',
    type: 'number',
    example: 999.99,
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Total price for this line item (unitPrice * quantity)',
    type: 'number',
    example: 1999.98,
  })
  @IsNumber()
  lineTotal: number;

  @ApiProperty({
    description: 'Quantity of items ordered',
    type: 'number',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Product image URL',
    type: 'string',
    format: 'url',
    example: 'https://example.com/images/iphone15.jpg',
  })
  @IsString()
  image: string;
}

export class ShippingDetailsDto {
  @ApiProperty({
    description: 'Shipping address line 1',
    type: 'string',
    example: '123 Main Street',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Shipping city',
    type: 'string',
    example: 'Lagos',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Shipping state or region',
    type: 'string',
    example: 'Lagos State',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Postal or zip code',
    type: 'string',
    required: false,
    example: '100001',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'Shipping country',
    type: 'string',
    example: 'Nigeria',
  })
  @IsString()
  country: string;
}

export class CreateOrderResponseDto {
  @ApiProperty({
    description: 'Response message',
    type: 'string',
    example: 'Order created successfully',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Flutterwave payment link for completing payment',
    type: 'string',
    format: 'url',
    required: false,
    example: 'https://checkout.flutterwave.com/v3/hosted/pay/abc123xyz',
  })
  @IsString()
  flutterwavePaymentLink?: string;

  @ApiProperty({
    description: 'Customer full name',
    type: 'string',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Generated order ID',
    type: 'string',
    format: 'uuid',
    required: false,
    example: '789e0123-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty({
    description: 'Generated order number',
    type: 'string',
    required: false,
    example: 'ORD-1735350123456-742',
  })
  @IsString()
  @IsOptional()
  orderNumber?: string;

  @ApiProperty({
    description: 'Success status of the operation',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  success?: boolean;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Current status of the order',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment status of the order',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Total amount before tax and shipping',
    type: 'number',
    example: 150.0,
  })
  @IsNumber()
  subtotal: number;

  @ApiProperty({
    description: 'Tax percentage applied to the order',
    type: 'number',
    minimum: 0,
    maximum: 100,
    example: 7.5,
  })
  @IsNumber()
  @IsOptional()
  taxPercentage?: number;

  @ApiProperty({
    description: 'Tax amount calculated from subtotal',
    type: 'number',
    example: 11.25,
  })
  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @ApiProperty({
    description: 'Type of shipping selected',
    type: 'string',
    example: 'Within Lagos',
  })
  @IsString()
  shippingType: string;

  @ApiProperty({
    description: 'Shipping cost amount',
    type: 'number',
    example: 5.0,
  })
  @IsNumber()
  shippingAmount: number;

  @ApiProperty({
    description: 'Final total amount to be paid (subtotal + tax + shipping)',
    type: 'number',
    example: 166.25,
  })
  @IsNumber()
  orderTotal: number;

  @ApiProperty({
    description: 'Currency code for the order',
    type: 'string',
    enum: ['NGN', 'USD', 'EUR', 'GBP'],
    example: 'NGN',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Customer information',
    type: CustomerInfoDto,
  })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo: CustomerInfoDto;

  @ApiProperty({
    description: 'Array of products being ordered',
    type: [ProductInformationDto],
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => ProductInformationDto)
  productInfo: ProductInformationDto[];

  @ApiProperty({
    description: 'Shipping address details',
    type: ShippingDetailsDto,
  })
  @ValidateNested()
  @Type(() => ShippingDetailsDto)
  shippingDetails: ShippingDetailsDto;

  @ApiProperty({
    description: 'Tracking number for the shipment',
    type: 'string',
    required: false,
    example: 'TRK123456789',
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;
}
