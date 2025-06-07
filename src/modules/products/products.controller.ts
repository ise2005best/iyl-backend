import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
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
}
