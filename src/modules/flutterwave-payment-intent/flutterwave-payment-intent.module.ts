import { Module } from '@nestjs/common';
import { FlutterwavePaymentIntentService } from './flutterwave-payment-intent.service';

@Module({
  providers: [FlutterwavePaymentIntentService],
})
export class FlutterwavePaymentIntentModule {}
