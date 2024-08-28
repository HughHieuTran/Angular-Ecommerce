import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { min } from 'rxjs';
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
        const { limit, offset, name, minPrice, maxPrice, category, availability, rating } = paginationQuery;

        const query = this.productRepository.createQueryBuilder('product')
            .take(limit)
            .skip(offset)
            .orderBy('product.id', 'ASC');
        if (category) {
            query.andWhere('product.category = :category', { category: `${category}` });
        }
        if (name) {
            query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
        }

        if (minPrice && minPrice != null) {
            query.andWhere('product.price >= :minPrice', { minPrice });
        }

        if (maxPrice && maxPrice != null) {
            query.andWhere('product.price <= :maxPrice', { maxPrice });
        }

        //ratings
        if (rating) {
            const ratingArray = rating.toString().split(',').map(value => value.trim().toLowerCase() === 'true');

            const selectedRatings = ratingArray
                .map((isSelected, index) => isSelected ? index : null)
                .filter(rating => rating !== null);

            if (selectedRatings.length > 0) {
                query.andWhere('product.rating IN (:...selectedRatings)', { selectedRatings });
            }
        }

        if (availability) {
            const availabilityArray = availability.toString().split(',').map(value => value.trim().toLowerCase() === 'true');

            const availabilityConditions = [];
            if (availabilityArray[0]) {
                availabilityConditions.push('product.stock > 0');
            }
            if (availabilityArray[1]) {
                availabilityConditions.push('product.stock = 0');
            }
            if (availabilityConditions.length > 0) {
                query.andWhere("(" + availabilityConditions.join(' OR ') + ")");
            }
        }
        return query.getMany();
    }
    async create(): Promise<Product[]> {
        const products = [
            { name: 'Product 1 Product A', category: "Shirt", sku: 'ABC12312', trademark: 'ASDAWD2342', width: 5, length: 10, height: 15, manufacturer: 'Vietnam', rating: 0, price: 10000, stock: 10, image: 'assets/image/product/image1.jpg' },
            { name: 'Product 2 Product B', category: "Pants", sku: 'BCD23423', trademark: 'FGH56789', width: 6, length: 12, height: 18, manufacturer: 'China', rating: 4, price: 120000, stock: 15, image: 'assets/image/product/image2.jpg' },
            { name: 'Product 3 Product C', category: "Shoes", sku: 'CDE34534', trademark: 'IJK67890', width: 7, length: 14, height: 20, manufacturer: 'India', rating: 3, price: 150000, stock: 8, image: 'assets/image/product/image3.jpg' },
            { name: 'Product 4 Product D', category: "Pants", sku: 'DEF45645', trademark: 'LMN78901', width: 8, length: 16, height: 22, manufacturer: 'Mexico', rating: 4, price: 180000, stock: 0, image: 'assets/image/product/image4.jpg' },
            { name: 'Product 5 Product E', category: "Shirt", sku: 'EFG56756', trademark: 'OPQ89012', width: 5, length: 11, height: 17, manufacturer: 'USA', rating: 4, price: 200000, stock: 11, image: 'assets/image/product/image5.jpg' },
            { name: 'Product 6 Product F', category: "Pants", sku: 'FGH67867', trademark: 'RST90123', width: 9, length: 13, height: 19, manufacturer: 'Germany', rating: 3, price: 220000, stock: 0, image: 'assets/image/product/image6.jpg' },
            { name: 'Product 7 Product G', category: "Shirt", sku: 'GHI78978', trademark: 'UVW01234', width: 10, length: 15, height: 25, manufacturer: 'France', rating: 4, price: 250000, stock: 6, image: 'assets/image/product/image7.jpg' },
            { name: 'Product 8 Product H', category: "Hat", sku: 'HIJ89089', trademark: 'XYZ12345', width: 6, length: 12, height: 21, manufacturer: 'Italy', rating: 4, price: 270000, stock: 9, image: 'assets/image/product/image8.jpg' },
            { name: 'Product 9 Product I', category: "Shirt", sku: 'IJK90190', trademark: 'ABC23456', width: 7, length: 13, height: 23, manufacturer: 'South Korea', rating: 4, price: 300000, stock: 13, image: 'assets/image/product/image9.jpg' },
            { name: 'Product 10 Product J', category: "Pants", sku: 'JKL01201', trademark: 'DEF34567', width: 8, length: 14, height: 26, manufacturer: 'Brazil', rating: 1, price: 330000, stock: 8, image: 'assets/image/product/image10.jpg' },
            { name: 'Product 11 Product K', category: "Shirt", sku: 'KLM12312', trademark: 'GHI45678', width: 9, length: 15, height: 28, manufacturer: 'Japan', rating: 4, price: 350000, stock: 7, image: 'assets/image/product/image11.jpg' },
            { name: 'Product 12 Product L', category: "Shoes", sku: 'LMN23423', trademark: 'JKL56789', width: 10, length: 16, height: 30, manufacturer: 'Canada', rating: 2, price: 370000, stock: 12, image: 'assets/image/product/image12.jpg' },
            { name: 'Product 13 Product M', category: "Pants", sku: 'MNO34534', trademark: 'MNO67890', width: 5, length: 12, height: 18, manufacturer: 'Australia', rating: 4, price: 400000, stock: 14, image: 'assets/image/product/image13.jpg' },
            { name: 'Product 14 Product N', category: "Hat", sku: 'NOP45645', trademark: 'PQR78901', width: 6, length: 13, height: 19, manufacturer: 'Russia', rating: 4, price: 420000, stock: 6, image: 'assets/image/product/image14.jpg' },
            { name: 'Product 15 Product O', category: "Shoes", sku: 'OPQ56756', trademark: 'STU89012', width: 7, length: 14, height: 21, manufacturer: 'Turkey', rating: 0, price: 450000, stock: 5, image: 'assets/image/product/image15.jpg' },
            { name: 'Product 16 Product P', category: "Hat", sku: 'PQR67867', trademark: 'VWX90123', width: 8, length: 15, height: 23, manufacturer: 'Spain', rating: 3, price: 480000, stock: 8, image: 'assets/image/product/image16.jpg' },
            { name: 'Product 17 Product Q', category: "Pants", sku: 'QRS78978', trademark: 'YZA01234', width: 9, length: 16, height: 25, manufacturer: 'Netherlands', rating: 4, price: 500000, stock: 7, image: 'assets/image/product/image17.jpg' },
            { name: 'Product 18 Product R', category: "Shirt", sku: 'RST89089', trademark: 'BCD12345', width: 10, length: 17, height: 27, manufacturer: 'Sweden', rating: 4, price: 520000, stock: 9, image: 'assets/image/product/image13.jpg' },
            { name: 'Product 19 Product S', category: "Shoes", sku: 'STU90190', trademark: 'CDE23456', width: 5, length: 10, height: 20, manufacturer: 'Norway', rating: 3, price: 550000, stock: 10, image: 'assets/image/product/image14.jpg' },
            { name: 'Product 20 Product T', category: "Hat", sku: 'TUV01201', trademark: 'DEF34567', width: 6, length: 11, height: 22, manufacturer: 'Finland', rating: 4, price: 580000, stock: 8, image: 'assets/image/product/image15.jpg' }
        ];

        return await this.productRepository.save(products);
    }
    async deleteAll(): Promise<void> {
        await this.productRepository.clear();
    }

    async getCategories(): Promise<string[]> {
        const products = await this.productRepository.find();

        return Array.from(new Set(products.map(product => product.category)));
    }
}

export interface PaginationQueryDto {
    limit?: number | 10;
    offset?: number | 0;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string | undefined;
    availability?: boolean[] | undefined;
    rating: boolean[];
}
