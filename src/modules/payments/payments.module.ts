import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentIntent } from '../flutterwave-payment-intent/entities/flutterwave-payment-intent.entity';
import { FlutterwavePaymentIntentService } from '../flutterwave-payment-intent/flutterwave-payment-intent.service';
import { Order } from '../orders/entities/orders.entity';
import { Product, ProductVariant } from '../products/entities';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentIntent, Order, Product, ProductVariant]),
    EmailModule,
  ],
  providers: [PaymentsService, FlutterwavePaymentIntentService],
  controllers: [PaymentsController],
  exports: [PaymentsService, FlutterwavePaymentIntentService],
})
export class PaymentsModule {}
