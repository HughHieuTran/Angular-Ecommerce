import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

export interface CreateOrderItemDto {
    productId: number;
    quantity: number;
    totalPrice: number;
}

export interface CreateOrderDto {
    orderDate: string;
    email: string;
    orderItems: CreateOrderItemDto[];
}

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }
    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const { email, orderDate, orderItems } = createOrderDto;

        const user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new Error('User not found');
        }


        const order = this.orderRepository.create({
            orderDate,
            user,
            orderItems: [],
        });

        for (const item of orderItems) {
            const product = await this.productRepository.findOneBy({ id: item.productId });
            if (!product) {
                throw new NotFoundException(`Product with id ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new ConflictException(`Insufficient stock for product ${product.name}`);
            }
            product.stock -= item.quantity;
            await this.productRepository.save(product);

            const orderItem = this.orderItemRepository.create({
                product,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity,
            });

            order.orderItems.push(orderItem);
        }


        return this.orderRepository.save(order);
    }
    async findOrdersByEmail(email: string): Promise<Order[]> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new Error('User not found');
        }
        return this.orderRepository.find({ where: { user }, relations: ['orderItems', 'user'] });
    }
    async getAllOrders(): Promise<Order[]> {
        return (await this.orderRepository.find({ relations: ['orderItems', 'user'] }));
    }
    async deleteAllOrders(): Promise<void> {
        const orders = await this.orderRepository.find({ relations: ['orderItems'] });
        orders.forEach((order) => {
            order.orderItems.forEach((orderItem => {
                this.orderItemRepository.remove(orderItem);
            }))
            this.orderRepository.remove(order);
        })
    }
}
