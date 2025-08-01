import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resend } from 'resend';
import { Order } from '../orders/entities/orders.entity';
import { Repository } from 'typeorm';
import { receiptTemplate } from '../orders/templates/customer-receipt';
import { orderDelivered } from '../orders/templates/order-shipped';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOrderConfirmationEmailToCustomer(orderId: string) {
    // first, we need to fetch the order details from the database
    // then we will use the order details to send the email

    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    const htmlContent = receiptTemplate({
      orderNumber: order.orderNumber,
      subtotal: this.addCommas(order.subtotal),
      taxPercentage: order.taxPercentage,
      taxAmount: this.addCommas(order.taxAmount),
      shippingType: order.shippingType,
      shippingAmount: this.addCommas(order.shippingAmount),
      orderTotal: this.addCommas(order.orderTotal),
      currency: order.currency,
      customerDetails: {
        email: order.customerDetails.email,
        name: order.customerDetails.name,
        phone: order.customerDetails.phone,
      },
      items: order.productDetails.items.map((item) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: this.addCommas(item.unitPrice),
        lineTotal: this.addCommas(item.lineTotal),
        image: item.image,
      })),
      shippingAddress: {
        address: order.shippingDetails.address,
        city: order.shippingDetails.city,
        state: order.shippingDetails.state,
        country: order.shippingDetails.country,
        postalCode: order.shippingDetails.postalCode,
      },
    });

    // send email to the customer
    return await this.resend.emails.send({
      from: 'IYLMIBS <no-reply@iylmibs.com>',
      replyTo: 'ifyouleavemeillbescared@gmail.com',
      to: [`${order.customerDetails.email}`],
      subject: `Your order has been received`,
      html: htmlContent,
    });
  }

  async sendOrderConfirmationEmailToAdmin(orderId: string) {
    // first, we need to fetch the order details from the database
    // then we will use the order details to send the email

    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    const htmlContent = receiptTemplate({
      orderNumber: order.orderNumber,
      subtotal: this.addCommas(order.subtotal),
      taxPercentage: order.taxPercentage,
      taxAmount: this.addCommas(order.taxAmount),
      shippingType: order.shippingType,
      shippingAmount: this.addCommas(order.shippingAmount),
      orderTotal: this.addCommas(order.orderTotal),
      currency: order.currency,
      customerDetails: {
        email: order.customerDetails.email,
        name: order.customerDetails.name,
        phone: order.customerDetails.phone,
      },
      items: order.productDetails.items.map((item) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: this.addCommas(item.unitPrice),
        lineTotal: this.addCommas(item.lineTotal),
        image: item.image,
      })),
      shippingAddress: {
        address: order.shippingDetails.address,
        city: order.shippingDetails.city,
        state: order.shippingDetails.state,
        country: order.shippingDetails.country,
        postalCode: order.shippingDetails.postalCode,
      },
    });

    // send email to the customer
    return await this.resend.emails.send({
      from: 'IYLMIBS <no-reply@iylmibs.com>',
      to: [
        'ifyouleavemeillbescared@gmail.com',
        'Sergmonu@gmail.com',
        'aladetemitope0@gmail.com',
        'iseoluwaariyibi@gmail.com',
      ],
      subject: `New order from ${order.customerDetails.name}`,
      html: htmlContent,
    });
  }

  async orderDeliveredEmail(
    orders: Order,
    trackingNumber: string,
    deliveryPin: string,
    logisticsCompany: string,
  ) {
    const htmlContent = orderDelivered({
      currency: orders?.currency,
      orderNumber: orders?.orderNumber,
      trackingNumber: trackingNumber,
      shippingAddress: orders?.shippingDetails,
      items: orders.productDetails.items.map((item) => ({
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: this.addCommas(item.unitPrice),
        lineTotal: this.addCommas(item.lineTotal),
        image: item.image,
      })),
      deliveryCompany: logisticsCompany,
      deliveryPin: deliveryPin,
      customerDetails: orders?.customerDetails,
    });

    // send email to the customer
    return await this.resend.emails.send({
      from: 'IYLMIBS <no-reply@iylmibs.com>',
      replyTo: 'ifyouleavemeillbescared@gmail.com',
      to: [`${orders.customerDetails.email}`],
      subject: `Your order has been shipped!`,
      html: htmlContent,
    });
  }

  private addCommas(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
