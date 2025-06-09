import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CheckoutCalculateDto } from './dtos/checkout-calculate.dto';
import { CheckoutCalculateResponseDto } from './dtos/checkout-calculate-response.dto';

@ApiTags('Checkout')
@Controller('api/checkout')
export class CheckoutController {
  private readonly logger = new Logger(CheckoutController.name);

  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate checkout totals',
    description:
      'Calculate subtotal, tax, shipping options, and totals for given items and location. For Nigeria, returns both Lagos and Outside Lagos options. For international countries, returns single shipping option.',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout calculation completed successfully',
    type: CheckoutCalculateResponseDto,
    examples: {
      nigeria: {
        summary: 'Nigeria calculation',
        value: {
          subtotal: { amount: 50000, currency: 'NGN' },
          tax: {
            amount: 3750,
            rate: 0.075,
            currency: 'NGN',
            breakdown: [
              {
                name: 'VAT',
                rate: 0.075,
                amount: 3750,
                description: 'Value Added Tax (7.5%)',
              },
            ],
          },
          shippingOptions: [
            {
              zone: 'within_lagos',
              zoneName: 'Within Lagos',
              states: ['Lagos'],
              shipping: {
                method: 'standard',
                name: 'Standard Delivery',
                cost: 2000,
                currency: 'NGN',
                estimatedDays: '1-2 days',
                description: 'Standard Delivery',
              },
              total: { amount: 55750, currency: 'NGN' },
            },
            {
              zone: 'outside_lagos',
              zoneName: 'Outside Lagos',
              states: ['Abuja', 'Ogun', 'Rivers'],
              shipping: {
                method: 'standard',
                name: 'Standard Delivery',
                cost: 5000,
                currency: 'NGN',
                estimatedDays: '3-5 days',
                description: 'Standard Delivery',
              },
              total: { amount: 58750, currency: 'NGN' },
            },
          ],
          itemsSummary: ['Classic White T-Shirt (MD) x2'],
        },
      },
      international: {
        summary: 'International calculation',
        value: {
          subtotal: { amount: 50, currency: 'GBP' },
          tax: {
            amount: 0,
            rate: 0,
            currency: 'GBP',
            breakdown: [],
          },
          shippingOptions: [
            {
              zone: 'international_gbp',
              zoneName: 'International (GBP)',
              shipping: {
                method: 'standard',
                name: 'International Shipping',
                cost: 15,
                currency: 'GBP',
                estimatedDays: '7-14 days',
                description: 'International Shipping',
              },
              total: { amount: 65, currency: 'GBP' },
            },
          ],
          itemsSummary: ['Classic White T-Shirt (MD) x2'],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data, insufficient stock, or product not available in country',
    schema: {
      type: 'object',
      properties: {
        message: {
          oneOf: [
            {
              type: 'string',
              example:
                'Insufficient stock for Classic White T-Shirt (md). Available: 3, Requested: 5',
            },
            {
              type: 'string',
              example: 'Product Classic White T-Shirt is not available in DE',
            },
            {
              type: 'string',
              example: 'Mixed currencies not supported. Found: NGN, GBP',
            },
            {
              type: 'array',
              items: { type: 'string' },
              example: [
                'items should not be empty',
                'location.country should not be empty',
              ],
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error during calculation',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'An error occurred while calculating checkout',
        },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async calculateCheckout(
    @Body() calculateDto: CheckoutCalculateDto,
  ): Promise<CheckoutCalculateResponseDto> {
    this.logger.log(
      `Calculating checkout for country: ${calculateDto.location.country}, items: ${calculateDto.items.length}`,
    );

    try {
      const result = await this.checkoutService.calculateCheckout(calculateDto);

      this.logger.log(
        `Checkout calculated successfully for country: ${calculateDto.location.country}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Checkout calculation failed for country: ${calculateDto.location.country}`,
      );
      throw error;
    }
  }
}
