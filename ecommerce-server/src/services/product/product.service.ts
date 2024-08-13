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
            { name: 'Product 1 Product A', sku: 'ABC12312', trademark: 'ASDAWD2342', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 4, price: 10.99, stock: 100, image: 'assets/image/product/image1.jpg' },
            { name: 'Product 2 Product B', sku: 'BCD23423', trademark: 'FGH56789', width: 6, length: 12, height: 18, manufacturer: 'China', rating: 4, price: 12.49, stock: 150, image: 'assets/image/product/image2.jpg' },
            { name: 'Product 3 Product C', sku: 'CDE34534', trademark: 'IJK67890', width: 7, length: 14, height: 20, manufacturer: 'India', rating: 3, price: 15.00, stock: 80, image: 'assets/image/product/image3.jpg' },
            { name: 'Product 4 Product D', sku: 'DEF45645', trademark: 'LMN78901', width: 8, length: 16, height: 22, manufacturer: 'Mexico', rating: 4, price: 18.75, stock: 90, image: 'assets/image/product/image4.jpg' },
            { name: 'Product 5 Product E', sku: 'EFG56756', trademark: 'OPQ89012', width: 5, length: 11, height: 17, manufacturer: 'USA', rating: 4, price: 20.00, stock: 110, image: 'assets/image/product/image5.jpg' },
            { name: 'Product 6 Product F', sku: 'FGH67867', trademark: 'RST90123', width: 9, length: 13, height: 19, manufacturer: 'Germany', rating: 3, price: 22.30, stock: 70, image: 'assets/image/product/image6.jpg' },
            { name: 'Product 7 Product G', sku: 'GHI78978', trademark: 'UVW01234', width: 10, length: 15, height: 25, manufacturer: 'France', rating: 4, price: 25.40, stock: 60, image: 'assets/image/product/image7.jpg' },
            { name: 'Product 8 Product H', sku: 'HIJ89089', trademark: 'XYZ12345', width: 6, length: 12, height: 21, manufacturer: 'Italy', rating: 4, price: 27.60, stock: 95, image: 'assets/image/product/image8.jpg' },
            { name: 'Product 9 Product I', sku: 'IJK90190', trademark: 'ABC23456', width: 7, length: 13, height: 23, manufacturer: 'South Korea', rating: 4, price: 30.75, stock: 130, image: 'assets/image/product/image9.jpg' },
            { name: 'Product 10 Product J', sku: 'JKL01201', trademark: 'DEF34567', width: 8, length: 14, height: 26, manufacturer: 'Brazil', rating: 3, price: 33.90, stock: 85, image: 'assets/image/product/image10.jpg' },
            { name: 'Product 11 Product K', sku: 'KLM12312', trademark: 'GHI45678', width: 9, length: 15, height: 28, manufacturer: 'Japan', rating: 4, price: 35.20, stock: 75, image: 'assets/image/product/image11.jpg' },
            { name: 'Product 12 Product L', sku: 'LMN23423', trademark: 'JKL56789', width: 10, length: 16, height: 30, manufacturer: 'Canada', rating: 3, price: 37.45, stock: 120, image: 'assets/image/product/image12.jpg' },
            { name: 'Product 13 Product M', sku: 'MNO34534', trademark: 'MNO67890', width: 5, length: 12, height: 18, manufacturer: 'Australia', rating: 4, price: 40.50, stock: 140, image: 'assets/image/product/image13.jpg' },
            { name: 'Product 14 Product N', sku: 'NOP45645', trademark: 'PQR78901', width: 6, length: 13, height: 19, manufacturer: 'Russia', rating: 4, price: 42.60, stock: 60, image: 'assets/image/product/image14.jpg' },
            { name: 'Product 15 Product O', sku: 'OPQ56756', trademark: 'STU89012', width: 7, length: 14, height: 21, manufacturer: 'Turkey', rating: 4, price: 45.75, stock: 50, image: 'assets/image/product/image15.jpg' },
            { name: 'Product 16 Product P', sku: 'PQR67867', trademark: 'VWX90123', width: 8, length: 15, height: 23, manufacturer: 'Spain', rating: 3, price: 48.90, stock: 80, image: 'assets/image/product/image16.jpg' },
            { name: 'Product 17 Product Q', sku: 'QRS78978', trademark: 'YZA01234', width: 9, length: 16, height: 25, manufacturer: 'Netherlands', rating: 4, price: 50.10, stock: 70, image: 'assets/image/product/image17.jpg' },
            { name: 'Product 18 Product R', sku: 'RST89089', trademark: 'BCD12345', width: 10, length: 17, height: 27, manufacturer: 'Sweden', rating: 4, price: 52.30, stock: 90, image: 'assets/image/product/image18.jpg' },
            { name: 'Product 19 Product S', sku: 'STU90190', trademark: 'CDE23456', width: 5, length: 10, height: 20, manufacturer: 'Norway', rating: 4, price: 55.00, stock: 100, image: 'assets/image/product/image19.jpg' },
            { name: 'Product 20 Product T', sku: 'TUV01201', trademark: 'DEF34567', width: 6, length: 11, height: 22, manufacturer: 'Finland', rating: 4, price: 58.25, stock: 85, image: 'assets/image/product/image20.jpg' }
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
