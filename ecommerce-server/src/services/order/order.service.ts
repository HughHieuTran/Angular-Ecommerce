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
}

export interface updateORderItemDto {
    email: string;
    productId: number;
    quantity: number;
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
    async createOrUpdate(createOrderDto: CreateOrderDto): Promise<Order> {
        const { email, orderDate, orderItems } = createOrderDto;

        const user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new Error('User not found');
        }
        let order: Order = new Order();
        const oldOrder = await this.orderRepository.find({ where: { user, IsOrdered: false }, relations: ['orderItems', 'user'] });
        if (oldOrder.length > 0) {
            order = oldOrder[0];
            order.orderDate = orderDate;
            order.orderItems.forEach(element => {
                this.orderItemRepository.remove(element);
            });
            this.orderItemRepository.save(order.orderItems);
        } else {
            order = this.orderRepository.create({
                orderDate: new Date().toISOString(),
                user,
                orderItems: [],
                IsOrdered: false
            });
        }
        order.orderItems = [];
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
    async updateOrderItems(createOrderDto: updateORderItemDto): Promise<Order> {
        const { email, productId, quantity } = createOrderDto;

        const user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new Error('User not found');
        }
        let order: Order = new Order();
        const oldOrder = await this.orderRepository.find({ where: { user, IsOrdered: false }, relations: ['orderItems', 'orderItems.product', 'user'] });
        if (oldOrder.length > 0) {
            order = oldOrder[0];
            this.orderItemRepository.save(order.orderItems);
        } else {
            order = this.orderRepository.create({
                orderDate: new Date().toISOString(),
                user,
                orderItems: [],
                IsOrdered: false
            });
        }

        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`);
        }
        let oldQuantity = order.orderItems.find(x => x.product.id == productId)?.quantity ?? 0;
        let quantityChanges = (quantity < 0 ? 0 : quantity) - oldQuantity;
        if (product.stock < quantityChanges) {
            throw new ConflictException(`Insufficient stock for product ${product.name}`);
        }
        product.stock -= quantityChanges;
        await this.productRepository.save(product);

        if (order.orderItems.filter(x => x.product.id == productId).length > 0) {
            if (quantity <= 0) {
                this.orderItemRepository.remove(order.orderItems.find(x => x.product.id == productId));
                order.orderItems = order.orderItems.filter(x => x.product.id !== productId)
                await this.orderItemRepository.save(order.orderItems);
            }
            else {
                order.orderItems.find(x => x.product.id == productId).quantity = quantity;
            }
        } else {
            const orderItem = this.orderItemRepository.create({
                product,
                quantity: quantity,
                totalPrice: product.price * quantity,
            });
            order.orderItems.push(orderItem);
        }

        return this.orderRepository.save(order);

    }
    async addOrderItems(createOrderDto: updateORderItemDto): Promise<Order> {
        let { email, productId, quantity } = createOrderDto;

        const user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new Error('User not found');
        }
        let order: Order = new Order();
        const oldOrder = await this.orderRepository.find({ where: { user, IsOrdered: false }, relations: ['orderItems', 'orderItems.product', 'user'] });
        if (oldOrder.length > 0) {
            order = oldOrder[0];
            this.orderItemRepository.save(order.orderItems);
        } else {
            order = this.orderRepository.create({
                orderDate: new Date().toISOString(),
                user,
                orderItems: [],
                IsOrdered: false
            });
        }

        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`);
        }
        let oldQuantity = order.orderItems.find(x => x.product.id == productId)?.quantity ?? 0;
        if (quantity < -oldQuantity) quantity = -oldQuantity;

        if (product.stock < quantity) {
            throw new ConflictException(`Insufficient stock for product ${product.name}`);
        }
        product.stock -= quantity;
        await this.productRepository.save(product);

        if (order.orderItems.filter(x => x.product.id == productId).length > 0) {
            if (oldQuantity + quantity <= 0) {
                this.orderItemRepository.remove(order.orderItems.find(x => x.product.id == productId));
                order.orderItems = order.orderItems.filter(x => x.product.id !== productId)
                await this.orderItemRepository.save(order.orderItems);
            }
            else {
                order.orderItems.find(x => x.product.id == productId).quantity = oldQuantity + quantity;
            }
        } else {
            const orderItem = this.orderItemRepository.create({
                product,
                quantity: quantity,
                totalPrice: product.price * quantity,
            });
            order.orderItems.push(orderItem);
        }

        return this.orderRepository.save(order);

    }
    async findCartByEmail(email: string): Promise<Order[]> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new Error('User not found');
        }
        return this.orderRepository.find({ where: { user, IsOrdered: false }, relations: ['orderItems', 'orderItems.product', 'user'] });
    }
    async findHistoryOrdersByEmail(email: string): Promise<Order[]> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new Error('User not found');
        }
        return this.orderRepository.find({ where: { user, IsOrdered: true }, relations: ['orderItems', 'orderItems.product', 'user'] });
    }
    async getAllOrders(): Promise<Order[]> {
        return (await this.orderRepository.find({ relations: ['orderItems', 'orderItems.product', 'user'] }));
    }
    async deleteAllOrders(): Promise<void> {
        try {

            const orders = await this.orderRepository.find({ relations: ['orderItems'] });
            orders.forEach((order) => {
                order.orderItems.forEach((orderItem => {
                    this.orderItemRepository.remove(orderItem);
                }))
                this.orderItemRepository.save(order.orderItems);
                this.orderRepository.remove(order);
            })
        } catch { }
    }
}
