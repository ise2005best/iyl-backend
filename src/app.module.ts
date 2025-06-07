// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'iyl-store.sqlite', // This creates a file in your project root
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-creates tables from your entities
      logging: true, // Shows SQL queries in console (helpful for development)
    }),
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
