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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductMedia,
      ProductMetafield,
      ContextualPrice,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
