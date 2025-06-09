import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { ShippingService } from '../shipping/shipping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextualPrice, Product, ProductVariant } from '../products/entities';
import { ShippingModule } from '../shipping/shipping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariant, Product, ContextualPrice]),
    ShippingModule,
  ],
  providers: [CheckoutService, ShippingService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
