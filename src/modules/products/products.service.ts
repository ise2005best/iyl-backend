import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductMedia } from './entities/product-media.entity';
import { ProductMetafield } from './entities/product-metafield.entity';
import { ContextualPrice } from './entities/contextual-price.entity';
import { CreateProductDto } from './dtos/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantsRepository: Repository<ProductVariant>,
    @InjectRepository(ProductMedia)
    private mediaRepository: Repository<ProductMedia>,
    @InjectRepository(ProductMetafield)
    private metafieldsRepository: Repository<ProductMetafield>,
    @InjectRepository(ContextualPrice)
    private contextualPricesRepository: Repository<ContextualPrice>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productsRepository.create({
        title: createProductDto.title,
        description: createProductDto.description,
        totalInventory: 0,
      });

      const savedProduct = await this.productsRepository.save(product);

      // Create variants
      if (createProductDto.variants?.length) {
        const variants = createProductDto.variants.map((variantDto) =>
          this.variantsRepository.create({
            ...variantDto,
            productId: savedProduct.id,
          }),
        );
        await this.variantsRepository.save(variants);
      }

      // Create media
      if (createProductDto.media?.length) {
        const media = createProductDto.media.map((mediaDto) =>
          this.mediaRepository.create({
            ...mediaDto,
            productId: savedProduct.id,
          }),
        );
        await this.mediaRepository.save(media);
      }

      // Create metafields
      if (createProductDto.metafields?.length) {
        const metafields = createProductDto.metafields.map((metafieldDto) =>
          this.metafieldsRepository.create({
            ...metafieldDto,
            productId: savedProduct.id,
          }),
        );
        await this.metafieldsRepository.save(metafields);
      }

      // Create contextual pricing
      if (createProductDto.contextualPricing?.length) {
        const prices = createProductDto.contextualPricing.map((priceDto) =>
          this.contextualPricesRepository.create({
            ...priceDto,
            productId: savedProduct.id,
          }),
        );
        await this.contextualPricesRepository.save(prices);
      }

      // Update total inventory
      await this.productsRepository.update(savedProduct.id, {
        totalInventory: createProductDto?.variants?.reduce(
          (total, variant) => total + (variant.quantity || 0),
          0,
        ),
      });

      // Return complete product with relations
      const completeProduct = await this.productsRepository.findOne({
        where: { id: savedProduct.id },
        relations: ['variants', 'media', 'metafields', 'contextualPricing'],
      });

      if (!completeProduct) {
        throw new NotFoundException(
          `Product with ID ${savedProduct.id} not found after creation`,
        );
      }

      this.logger.log(`Created product: ${completeProduct.title}`);
      return completeProduct;
    } catch (error) {
      this.logger.error('Failed to create product', error);
      throw error;
    }
  }
}
