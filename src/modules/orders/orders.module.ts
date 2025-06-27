import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { PaymentsService } from '../payments/payments.service';
import { PaymentsModule } from '../payments/payments.module';
import { PaymentIntent } from '../flutterwave-payment-intent/entities/flutterwave-payment-intent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, PaymentIntent])],
    controllers: [OrdersController],
    providers: [OrdersService, PaymentsService],
})
export class OrdersModule {}
