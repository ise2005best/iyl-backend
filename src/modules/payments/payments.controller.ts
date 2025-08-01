import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentDto,
  UpdateOrderDto,
  VerifyPaymentDto,
} from './dtos/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('initialize')
  async initializePayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.intiatePayment(createPaymentDto);
  }

  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyPaymentDto);
  }

  @Post('ship-order')
  async shipOrder(@Body() dto: UpdateOrderDto) {
    return this.paymentsService.updateOrderWithTrackingNumber(dto);
  }
}
