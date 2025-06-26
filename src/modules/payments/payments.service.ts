import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as crypto from 'crypto';
import { CreatePaymentDto, VerifyPaymentDto } from './dtos/create-payment.dto';

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
  constructor() {
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
      const payload = {
        tx_ref: `iylmibs-${crypto.randomBytes(16).toString('hex')}`,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'NGN',
        redirect_url:
          createPaymentDto.redirect_url || 'https://iylmibs.vercel.app',
        payment_options: 'card, ussd, banktransfer, googlepay, applepay, bank',
        customer: createPaymentDto.customer,
        customizations: {
          title: 'IYLMIBS',
          description: 'Payment for IYLMIBS products',
          logo: 'https://res.cloudinary.com/dmkomqw3p/image/upload/v1749643809/1_demtho.png',
        },
      };

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
      console.log(error)
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

      if (response.data.status === 'success') {
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
