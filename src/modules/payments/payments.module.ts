import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentIntent } from '../flutterwave-payment-intent/entities/flutterwave-payment-intent.entity';
import { FlutterwavePaymentIntentService } from '../flutterwave-payment-intent/flutterwave-payment-intent.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentIntent])],
  providers: [PaymentsService, FlutterwavePaymentIntentService],
  controllers: [PaymentsController],
  exports: [PaymentsService, FlutterwavePaymentIntentService],
})
export class PaymentsModule {}
