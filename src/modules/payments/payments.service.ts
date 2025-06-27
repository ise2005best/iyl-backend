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
import { Repository } from 'typeorm';

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
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_TEST_SECRET_KEY}`,
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
      const payload = {
        tx_ref: `iylmibs-${crypto.randomBytes(16).toString('hex')}`,
        // have to convert amount to a number, flutterwave expects it as a number
        // but we store it as a decimal in the database
        amount: Number(createPaymentDto.amount),
        currency: createPaymentDto.currency || 'NGN',
        redirect_url:
          createPaymentDto.redirect_url || `${process.env.FRONTEND_URL}/orders/verify-payment`,
        payment_options: 'card, ussd, banktransfer, googlepay, applepay, bank',
        customer: createPaymentDto.customer,
        customizations: {
          title: 'IYLMIBS',
          description: 'Payment for IYLMIBS products',
          logo: 'https://res.cloudinary.com/dmkomqw3p/image/upload/v1749643809/1_demtho.png',
        },
      };

      // add payment intent to the database
      const flutterwavePaymentIntent = this.paymentIntentRepository.create({
        expectedAmount: createPaymentDto.amount,
        expectedCurrency: createPaymentDto.currency || 'NGN',
        txRef: payload.tx_ref,
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
  ): Promise<{ status: string; data: any }> {
    try {
      const response = await this.axiosInstance.get(
        `/transactions/${verifyPaymentDto.transaction_id}/verify`,
      );

      // get the payment intent from db to ensure the amount the user paid is the same as the expected amount
      const paymentIntent = await this.paymentIntentRepository.findOne({
        where: { txRef: verifyPaymentDto.transaction_ref },
      });
      if (!paymentIntent) {
        throw new BadRequestException(
          'Payment intent not found for the provided transaction reference',
        );
      }
      const returnedStatus = response.data.status;
      const returnedAmount = response.data.data.amount;
      const returnedCurrency = response.data.data.currency;
      // database stores amount as a decimal, e.g 200.00 but flutterwave returns it as integer e.g 200
      // so we need to compare the amounts accordingly
      const expectedAmount = Number(paymentIntent.expectedAmount);

      if (
        returnedStatus === 'success' &&
        returnedAmount === expectedAmount &&
        returnedCurrency === paymentIntent.expectedCurrency
      ) {
        console.log(
          `Payment verified successfully: ${verifyPaymentDto.transaction_id}`,
        );
        console.log('Verification response:', response.data);
        return {
          status: 'success',
          data: response.data.data,
        };
      } else {
        throw new BadRequestException(
          `Payment verification failed: ${response.data.message}`,
        );
      }
    } catch (error) {
      console.error(error, 'Payment verification failed');
      throw new InternalServerErrorException(
        'Payment verification failed',
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
