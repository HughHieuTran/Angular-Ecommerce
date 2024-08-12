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
    async create(): Promise<Product[]> {
        const products = [
            { name: 'Product A Product A', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product B Product B', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product C Product C', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product D Product D', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product E Product E', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product F Product F', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product G Product G', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 1 Product 1', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 2 Product 2', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 3 Product 3', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 4 Product 4', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 5 Product 5', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 6 Product 6', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 7 Product 7', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product A Product A', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product B Product B', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product C Product C', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product D Product D', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product E Product E', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product F Product F', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product G Product G', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 1 Product 1', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 2 Product 2', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 3 Product 3', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 4 Product 4', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 5 Product 5', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 6 Product 6', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },
            { name: 'Product 7 Product 7', sku: '', trademark: '', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100 },

        ];

        return await this.productRepository.save(products);
    }
    async deleteAll(): Promise<void> {
        await this.productRepository.clear();
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
