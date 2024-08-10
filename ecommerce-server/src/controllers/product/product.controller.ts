import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { PaginationQueryDto, ProductService } from 'src/services/product/product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productsService: ProductService) { }

    @Get()
    async getAllProducts(@Query() paginationQuery: PaginationQueryDto): Promise<Product[]> {
        return this.productsService.findAll(paginationQuery);
    }

    @Post()
    async populateProducts(): Promise<{ message: string }> {
        await this.productsService.create();
        return { message: 'All products have been created successfully' };
    }

    @Delete()
    async deleteAll(): Promise<{ message: string }> {
        await this.productsService.deleteAll();
        return { message: 'All products have been deleted successfully' };
    }
}
