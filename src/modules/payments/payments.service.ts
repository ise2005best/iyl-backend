import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as crypto from 'crypto';
import { CreatePaymentDto, VerifyPaymentDto } from './dtos/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentIntent } from '../flutterwave-payment-intent/entities/flutterwave-payment-intent.entity';
import { QueryRunner, Repository } from 'typeorm';
import {
  Order,
  OrderStatus,
  PaymentStatus,
} from '../orders/entities/orders.entity';
import { Product, ProductVariant } from '../products/entities';
import { EmailService } from '../email/email.service';

interface FlutterwaveResponse {
  data: {
    status: string | null;
    message: string;
    data?: {
      link?: string;
    };
  };
}

@Injectable()
export class PaymentsService {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  constructor(
    @InjectRepository(PaymentIntent)
    private paymentIntentRepository: Repository<PaymentIntent>,
    private readonly emailService: EmailService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          `Making request to: ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => {
        console.error('Request error:', error);
      },
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.debug(
          `Response from ${response.config.url}: ${response.status}`,
        );
        return response;
      },
      (error: AxiosError) => {
        console.error(
          `API Error: ${error.response?.status} - ${error.message}`,
        );
        return Promise.reject(error);
      },
    );
  }

  async intiatePayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<{ status: string; data: { link: string; tx_ref: string } }> {
    try {
      console.log('Initializing payment with data:', createPaymentDto);
      const payload = {
        tx_ref: `iylmibs-${crypto.randomBytes(16).toString('hex')}`,
        // have to convert amount to a number, flutterwave expects it as a number
        // but we store it as a decimal in the database
        amount: Number(createPaymentDto.amount),
        currency: createPaymentDto.currency || 'NGN',
        redirect_url:
          createPaymentDto.redirect_url ||
          `${process.env.FRONTEND_URL}/store/orders/verify-payment`,
        payment_options: 'card, ussd, banktransfer, googlepay, applepay, bank',
        customer: createPaymentDto.customer,
        customizations: {
          title: 'IYLMIBS',
          description: 'Payment for IYLMIBS products',
          logo: 'https://res.cloudinary.com/dmkomqw3p/image/upload/v1749643809/1_demtho.png',
        },
      };

      // add payment intent to the database and add the orderId of the order
      // that this payment intent is associated with
      const flutterwavePaymentIntent = this.paymentIntentRepository.create({
        expectedAmount: createPaymentDto.amount,
        expectedCurrency: createPaymentDto.currency || 'NGN',
        txRef: payload.tx_ref,
        orderNumber: createPaymentDto.orderNumber,
      });
      await this.paymentIntentRepository.save(flutterwavePaymentIntent);

      const response: FlutterwaveResponse = await this.axiosInstance.post(
        '/payments',
        payload,
      );
      console.log('Payment initialization response:', response.data);
      if (response?.data?.status === 'success') {
        return {
          status: 'success',
          data: {
            link: response?.data?.data?.link || '',
            tx_ref: payload.tx_ref,
          },
        };
      } else {
        throw new BadRequestException('Failed to initialize payment');
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Payment initialization failed',
        error,
      );
    }
  }
  async verifyPayment(
    verifyPaymentDto: VerifyPaymentDto,
  ): Promise<{ status: string; success: boolean }> {
    // create a query runner to handle transactions to ensure ACID properties
    // since we are updating multiple tables and we want to ensure that either all updates succeed or none of them do
    const queryRunner =
      this.paymentIntentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // check 1
      // check if the payment has already been processed
      const paymentIntent = await queryRunner.manager.findOne(PaymentIntent, {
        where: { txRef: verifyPaymentDto.tx_ref, status: 'Completed' },
      });

      if (!paymentIntent) {
        throw new BadRequestException(
          'Payment intent not found for the provided transaction reference',
        );
      }

      // check 2
      // if the payment intent is already completed, we return success
      if (paymentIntent.status === 'Completed') {
        await queryRunner.rollbackTransaction();
        return {
          status: 'success, payment already completed',
          success: true,
        };
      }

      // check 3
      // if the payment intent is still processing, we return an error
      // to avoid double processing of the payment
      if (paymentIntent.status === 'processing') {
        await queryRunner.rollbackTransaction();
        throw new BadRequestException('Payment is currently being processed');
      }

      // Once all checks are passed, the payment intent is marked as processing
      await queryRunner.manager.update(
        PaymentIntent,
        { id: paymentIntent.id },
        { status: 'processing', updatedAt: new Date() },
      );

      const response = await this.axiosInstance.get(
        `/transactions/${verifyPaymentDto.transaction_id}/verify`,
      );

      const returnedStatus = response.data.status;
      const returnedAmount = response.data.data.amount;
      const returnedCurrency = response.data.data.currency;
      // database stores amount as a decimal, e.g 200.00 but flutterwave returns it as integer e.g 200
      // so we need to compare the amounts accordingly
      const expectedAmount = Number(paymentIntent.expectedAmount);
      // ensure all the amounts are the same so the user is not charged more than expected or charged less than expected
      if (
        (returnedStatus === 'success' || returnedStatus === 'completed') &&
        returnedAmount === expectedAmount &&
        returnedCurrency === paymentIntent.expectedCurrency
      ) {
        // update the payment intent status and flutterwave transaction id
        // update the order status to completed and payment status to completed

        // lets update all necessary details atomically
        // update the payment intent status to completed
        await queryRunner.manager.update(
          PaymentIntent,
          { txRef: paymentIntent.txRef },
          {
            status: 'Completed',
            flutterwaveTransactionId: verifyPaymentDto.transaction_id,
            updatedAt: new Date(),
          },
        );

        // update the order status to confirmed and payment status to paid
        await queryRunner.manager.update(
          Order,
          { orderNumber: paymentIntent.orderNumber },
          {
            status: OrderStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
            paymentIntentId: paymentIntent.id,
            updatedAt: new Date(),
          },
        );

        // next we update the product inventory and reduce the stock
        const order = await queryRunner.manager.findOne(Order, {
          where: { orderNumber: paymentIntent.orderNumber },
        });
        if (!order) {
          throw new Error(`Order ${paymentIntent.orderNumber} not found`);
        }

        // update the product inventory based on the order details
        for (const product of order?.productDetails.items || []) {
          await this.updateProductInventory(queryRunner, {
            id: product.productId,
            variantId: product.variantId,
            quantity: product.quantity,
          });
        }

        // commit the transaction
        await queryRunner.commitTransaction();

        // after committing the transaction, we can now send the order confirmation emails
        // next we send emails to the customer and the admin about the receipt of the order
        // await this.emailService.sendOrderConfirmationEmailToCustomer(order.id);
        // await this.emailService.sendOrderConfirmationEmailToAdmin(order.id);

        return {
          success: true,
          status: 'success',
        };
      } else {
        // if the payment verification fails, we change the status of the payment intent to failed and rollback the transaction
        await queryRunner.manager.update(
          PaymentIntent,
          { id: paymentIntent.id },
          { status: 'Failed', updatedAt: new Date() },
        );
        await queryRunner.commitTransaction();
        throw new BadRequestException(
          `Payment verification failed: ${response.data.message}`,
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error, 'Payment verification failed');
      throw new InternalServerErrorException(
        'Payment verification failed',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private async updateProductInventory(
    queryRunner: QueryRunner,
    product: {
      id: string;
      variantId: number;
      quantity: number;
    },
  ) {
    // update the total inventory of the product
    await queryRunner.manager
      .createQueryBuilder()
      .update(Product)
      .set({
        totalInventory: () => `totalInventory - ${product.quantity}`,
      })
      .where('id = :id', {
        id: product.id,
      })
      .execute();

    // update the quantity of the product variant
    await queryRunner.manager
      .createQueryBuilder()
      .update(ProductVariant)
      .set({
        quantity: () => `quantity - ${product.quantity}`,
      })
      .where('id = :id', {
        id: product.variantId,
      })
      .execute();
  }
}
