import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto, OrderService } from 'src/services/order/order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly ordersService: OrderService){}
    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
      return this.ordersService.create(createOrderDto);
    }
  
    @Get()
    async getAllOrders(): Promise<Order[]> {
      return this.ordersService.getAllOrders();
    }
  
    @Get(':email')
    async getAllOrdersByEmail(@Param('email') email: string): Promise<Order[]> {
      return this.ordersService.findOrdersByEmail(email);
    }
}
