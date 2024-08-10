import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>) { }

    async findAll(paginationQuery: PaginationQueryDto): Promise<Product[]> {
        const { limit, offset, name, minPrice, maxPrice, minStock } = paginationQuery;

        const query = this.productRepository.createQueryBuilder('product')
            .take(limit)
            .skip(offset);

        if (name) {
            query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
        }

        if (minPrice !== undefined) {
            query.andWhere('product.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            query.andWhere('product.price <= :maxPrice', { maxPrice });
        }

        if (minStock !== undefined) {
            query.andWhere('product.stock >= :minStock', { minStock });
        }

        return query.getMany();
    }

}

export interface PaginationQueryDto {
    limit?: number | 10; // Default limit
    offset?: number | 0; // Default offset
    name?: string; // Search by product name
    minPrice?: number; // Minimum price for filtering
    maxPrice?: number; // Maximum price for filtering
    minStock?: number; // Minimum stock for filtering
}
