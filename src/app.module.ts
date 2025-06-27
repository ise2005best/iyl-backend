// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FlutterwavePaymentIntentModule } from './modules/flutterwave-payment-intent/flutterwave-payment-intent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // Automatically loads entities from modules
      synchronize: true, // Auto-creates tables from your entities
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    OrdersModule,
    ProductsModule,
    CheckoutModule,
    ShippingModule,
    PaymentsModule,
    FlutterwavePaymentIntentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
