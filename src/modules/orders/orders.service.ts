import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/orders.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';
import { CreatePaymentDto } from '../payments/dtos/create-payment.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private paymentService: PaymentsService,
  ) {}

  async createOrder(
    orderData: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    // lot of logic to handle order creation
    // start we initiate the order and call the create payment service
    // then we save the order to the database
    // the verify payment service will update the order status
    // it will also update the product inventory
    // and send the order confirmation email to both the customer and the admin
    // for order number we use
    try {
      console.log('Creating order with data:', orderData);
      const paymentPayload: CreatePaymentDto = {
        amount: orderData.orderTotal,
        currency: orderData.currency,
        redirect_url: `${process.env.FRONTEND_URL}/orders/verify-payment`,
        customer: {
          email: orderData.customerInfo.email,
          phonenumber: orderData.customerInfo.phone,
          name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        },
      };

      const initializeFlutterwavePayment =
        await this.paymentService.intiatePayment(paymentPayload);
      console.log(
        'Flutterwave payment initialized:',
        initializeFlutterwavePayment,
      );

      const payload = {
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: orderData.subtotal,
        taxPercentage: orderData.taxPercentage,
        taxAmount: orderData.taxAmount,
        shippingType: orderData.shippingType,
        shippingAmount: orderData.shippingAmount,
        orderTotal: orderData.orderTotal,
        currency: orderData.currency,
        customerDetails: {
          email: orderData.customerInfo.email,
          name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
          phone: orderData.customerInfo.phone,
        },
        productDetails: {
          items: orderData.productInfo.map((product) => ({
            productId: product.productId,
            variantId: product.variantId,
            productName: product.productName,
            variantName: product.variantName,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            lineTotal: product.lineTotal,
            image: product.image,
          })),
        },
        shippingDetails: {
          address: orderData.shippingDetails.address,
          city: orderData.shippingDetails.city,
          state: orderData.shippingDetails.state,
          country: orderData.shippingDetails.country,
          postalCode: orderData.shippingDetails.postalCode,
        },
      };
      console.log('Order payload:', payload);
      const order = this.ordersRepository.create(payload);
      await this.ordersRepository.save(order);
      return {
        message: 'Order created successfully',
        fullName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        flutterwavePaymentLink: initializeFlutterwavePayment.data.link,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order. Please try again later.');
    }
  }
}
