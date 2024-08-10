import { Controller, Get, Query } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { PaginationQueryDto, ProductService } from 'src/services/product/product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productsService: ProductService) { }

    @Get()
    async getAllProducts(@Query() paginationQuery: PaginationQueryDto): Promise<Product[]> {
        return this.productsService.findAll(paginationQuery);
    }
}
