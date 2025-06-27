import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new order',
        description: 'Creates a new order with the provided details and initiates payment processing.',
    })
    @ApiBody({
        type: CreateOrderDto,
        description: 'Order data including customer details, items, and payment information.',
    })
    @ApiResponse({
        status: 201,
        description: 'Order created successfully',
        type: CreateOrderResponseDto,
    })
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponseDto> {
        return this.ordersService.createOrder(createOrderDto);
    }
}
