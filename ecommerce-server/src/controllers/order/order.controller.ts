import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto, OrderService, updateORderItemDto } from 'src/services/order/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) { }
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrUpdate(createOrderDto);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    try {

      return this.ordersService.getAllOrders();
    } catch { }
  }

  @Get('history/:email')
  async getAllOrdersByEmail(@Param('email') email: string): Promise<Order[]> {
    return this.ordersService.findHistoryOrdersByEmail(email);
  }

  @Get(':email')
  async getCart(@Param('email') email: string): Promise<Order[]> {
    return this.ordersService.findCartByEmail(email);
  }

  @Post("update")
  async updateCartItems(@Body() createorderi: updateORderItemDto): Promise<Order> {
    return this.ordersService.updateOrderItems(createorderi);
  }
  @Post("add")
  async addToCartItems(@Body() createorderi: updateORderItemDto): Promise<Order> {
    return this.ordersService.addOrderItems(createorderi);
  }

  @Post('pay/:email')
  async payOrder(@Param('email') email: string, @Body() { address, phoneNumber }): Promise<boolean> {
    return this.ordersService.payOrder(email, address, phoneNumber);
  }

  @Delete()
  async deleteAllOrders(): Promise<{ message: string }> {
    try {
      await this.ordersService.deleteAllOrders();
    } catch (error) {
      return { message: "failed" };
    }
    return { message: "done" };
  }
}
