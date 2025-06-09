import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ContextualPrice,
  Product,
  ProductVariant,
  ProductMedia,
  ProductMetafield,
} from './entities/index';
import { ShippingModule } from '../shipping/shipping.module';
import { ShippingService } from '../shipping/shipping.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductMedia,
      ProductMetafield,
      ContextualPrice,
    ]),
    ShippingModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ShippingService],
})
export class ProductsModule {}
