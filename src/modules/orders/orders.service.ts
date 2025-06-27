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
    // start we initiate the order by creating a new order and setting its status to pending and payment status to pending
    // then we save the order to the database
    // after that we initiate the payment using the payment service and pass order id to be able to be able to update the order status later
    // the verify payment service will update the order status
    // it will also update the product inventory
    // and send the order confirmation email to both the customer and the admin
    try {
      // create the order payload
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
      // save the order to the database
      const order = this.ordersRepository.create(payload);
      await this.ordersRepository.save(order);

      // create the payment payload
      const paymentPayload: CreatePaymentDto = {
        amount: orderData.orderTotal,
        currency: orderData.currency,
        redirect_url: `${process.env.FRONTEND_URL}/store/orders/verify-payment`,
        orderNumber: order.orderNumber,
        customer: {
          email: orderData.customerInfo.email,
          phonenumber: orderData.customerInfo.phone,
          name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        },
      };

      const initializeFlutterwavePayment =
        await this.paymentService.intiatePayment(paymentPayload);
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

  private async generateOrderNumber(): Promise<string> {
    const orderCount = await this.ordersRepository.count();
    const orderNumber = 1000 + orderCount;
    return orderNumber.toString();
  }
}
