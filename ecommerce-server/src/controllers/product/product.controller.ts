import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { PaginationQueryDto, ProductService } from 'src/services/product/product.service';

interface Products {
    products: Product[];
    total: number
}
@Controller('product')
export class ProductController {
    constructor(private readonly productsService: ProductService) { }

    @Get()
    async getAllProducts(@Query() paginationQuery: PaginationQueryDto): Promise<Products> {
        const searchQuery: PaginationQueryDto = {
            limit: 9999,
            offset: 0,
            name: paginationQuery?.name
        }
        const totalCount = (await this.productsService.findAll(searchQuery)).length;
        const products = await this.productsService.findAll(paginationQuery);
        return { products, total: totalCount }
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
