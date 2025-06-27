import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @ApiOperation({
    summary: 'Send order confirmation email',
    description:
      'Sends an order confirmation email to the customer after an order is created.',
  })
  @ApiBody({
    type: String,
    description: 'Order ID for which the confirmation email is to be sent.',
  })
  @Post('order-confirmation')
  async sendOrderConfirmationEmail(@Body('orderId') orderId: string) {
    return await this.emailService.sendOrderConfirmationEmailToCustomer(
      orderId,
    );
  }
}
