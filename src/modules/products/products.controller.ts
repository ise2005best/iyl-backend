import { Controller, Post, Body, HttpStatus, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductResponseDto } from './dtos/product-response.dto';
import { CreateProductDto } from './dtos/product.dto';
import { CountryCode } from './entities/contextual-price.entity';
import { ProductMetafield } from './entities';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Create a new product with variants, media, metafields, and contextual pricing',
  })
  @ApiBody({
    type: CreateProductDto,
    description:
      'Product data including variants, media, and pricing information',
  })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'title should not be empty',
            'variants should not be empty',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve a list of all available products',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    type: [Product],
  })
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':countryCode')
  @ApiOperation({
    summary: 'Get all products by country code',
    description: 'Retrieve a list of all products by country code',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    type: [Product],
  })
  async getProductsByCountry(
    @Param('countryCode') countryCode: CountryCode,
  ): Promise<Product[]> {
    return this.productsService.getProductsByCountry(countryCode);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a product by its unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: Product,
  })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post('/product-metafield')
  @ApiOperation({
    summary: 'Create a product metafield',
    description: 'Add a metafield to an existing product',
  })
  @ApiBody({
    type: ProductMetafield,
    description: 'Metafield data to be added to the product',
  })
  async addProductMetafield(
    @Param('productId') productId: string,
    @Body() metafield: ProductMetafield,
  ): Promise<ProductMetafield> {
    return this.productsService.addProductMetafield(productId, metafield);
  }
}
