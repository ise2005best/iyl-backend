import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductVariant } from '../products/entities';
import { ContextualPrice } from '../products/entities';
import { ShippingService } from '../shipping/shipping.service';
import { Product } from '../products/entities';
import {
  CheckoutCalculateDto,
  CheckoutItemDto,
} from './dtos/checkout-calculate.dto';
import {
  CheckoutCalculateResponseDto,
  MoneyDto,
  ProductDto,
} from './dtos/checkout-calculate-response.dto';
import { TaxCalculation } from './dtos/tax-interface';

interface itemAfterCalculation {
  variant: ProductVariant;
  product: Product;
  quantity: number;
  lineTotal: number;
  unitPrice: number;
  currency: string;
}

interface ShippingCode {
  country: string;
}

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private product: Repository<Product>,
    @InjectRepository(ContextualPrice)
    private contextualPriceRepository: Repository<ContextualPrice>,
    private shippingService: ShippingService,
  ) {}

  async calculateCheckout(
    data: CheckoutCalculateDto,
  ): Promise<CheckoutCalculateResponseDto> {
    // get product details and calculate products total

    // Validate and calculate items
    const calculatedItems = await this.validateAndCalculateItems(
      data.items,
      data.location.country,
    );

    // calculate total
    const total = this.calculateSubtotal(calculatedItems);

    // Determine shipping zone
    const shippingZones = this.shippingService.getShippingZones(
      data.location.country,
    );

    // calculate tax, if country is NG, calculate Nigerian tax else calculate no tax
    const tax =
      data.location.country.toUpperCase() === 'NG'
        ? this.calculateNigerianTax(total.amount)
        : this.getNoTax(total.currency);

    const productVariantIds = data.items.map((item) => item.productVariantId);

    const productDetailsList = await this.productVariantRepository.find({
      where: { id: In(productVariantIds) },
      relations: ['product'],
      select: ['id', 'product', 'title'],
    });

    const products: ProductDto[] = productDetailsList.map((productDetails) => {
      const calculatedItem = calculatedItems.find(
        (item) => item.product.id === productDetails.product.id,
      );
      const quantity = calculatedItem?.quantity || 0;
      const unitPrice = calculatedItem?.unitPrice || 0;
      const currency = calculatedItem?.currency || 'USD';
      const totalPrice = Math.round(unitPrice * quantity * 100) / 100;

      return {
        name: productDetails.product.title,
        variant: productDetails.title,
        currency: currency,
        unitPrice: unitPrice,
        quantity: quantity,
        totalPrice: totalPrice,
      };
    });

    // calculate total for each shipping option
    const shippingOptions = shippingZones.zones.map((zone) => ({
      zone: zone.zone,
      zoneName: zone.zoneName,
      states: zone.states || [],
      shippingMethod: {
        name: zone.shippingMethod.name,
        cost: zone.shippingMethod.cost,
        currency: zone.shippingMethod.currency,
        description: zone.shippingMethod.description,
        estimatedDelivery: zone.shippingMethod.estimatedDelivery,
      },
      total: {
        amount:
          Math.round(
            (total.amount + zone.shippingMethod.cost + tax.amount) * 100,
          ) / 100,
        currency: total.currency,
      },
    }));
    return {
      total,
      tax,
      shippingOptions,
      products,
    };
  }

  private async validateAndCalculateItems(
    items: CheckoutItemDto[],
    country: string,
  ): Promise<itemAfterCalculation[]> {
    const calculatedItems: itemAfterCalculation[] = [];
    // Check if country is in shipping zones
    let countryCode: ShippingCode;
    const usdZoneCountries =
      this.shippingService.getCountriesInZone('international_usd');
    const gbpZoneCountries =
      this.shippingService.getCountriesInZone('international_gbp');
    if (usdZoneCountries.includes(country)) {
      countryCode = { country: 'US' };
    } else if (gbpZoneCountries.includes(country)) {
      countryCode = { country: 'GB' };
    } else {
      countryCode = { country: 'NG' };
    }

    for (const item of items) {
      // Get product variants
      const variant = await this.productVariantRepository.findOne({
        where: { id: item.productVariantId },
        relations: ['product'],
      });

      if (!variant) {
        throw new NotFoundException(
          `Product variant with ID ${item.productVariantId} not found`,
        );
      }

      // Check if stock is available
      if (variant.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product variant with ID ${item.productVariantId}`,
        );
      }

      // get contextual price for country
      const price = await this.contextualPriceRepository.findOne({
        where: {
          productId: variant.productId,
          country: countryCode.country.toUpperCase(),
        },
      });

      if (!price) {
        throw new NotFoundException(
          `Contextual price not found for product ID ${variant.product.id} in country ${country}`,
        );
      }

      const lineTotal = price.amount * item.quantity;

      calculatedItems.push({
        variant,
        product: variant.product,
        lineTotal,
        quantity: item.quantity,
        unitPrice: price.amount,
        currency: price.currencyCode,
      });
    }

    return calculatedItems;
  }
  private calculateSubtotal(items: itemAfterCalculation[]): MoneyDto {
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const currency = items[0]?.currency;

    return {
      amount: Math.round(total * 100) / 100,
      currency,
    };
  }
  private calculateNigerianTax(subtotal: number): TaxCalculation {
    const taxRate = 0.075; // 7.5% VAT in Nigeria

    const vatAmount = Math.round(subtotal * taxRate * 100) / 100;
    return {
      amount: vatAmount,
      rate: taxRate,
      currency: 'NGN',
      breakdown: [
        {
          name: 'VAT',
          rate: taxRate,
          amount: vatAmount,
          description: 'Value Added Tax',
        },
      ],
    };
  }

  private getNoTax(currency: string): TaxCalculation {
    return {
      amount: 0,
      rate: 0,
      currency,
      breakdown: [],
    };
  }
}
