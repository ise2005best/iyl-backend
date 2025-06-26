import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  phonenumber?: string;

  @IsString()
  name?: string;
}

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsOptional()
  redirect_url: string;

  @IsOptional()
  customer?: CustomerDto;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;
}
