import { Component, ViewChild } from '@angular/core';
import { SearchComponent } from '../components/search/search.component';
import { ProductService } from '../services/product.service';
import { Product, ProductQueryParams } from '../../types/types';
import { ProductCardComponent } from "../components/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, ProductCardComponent, CommonModule, PaginatorModule, SidebarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private readonly productService: ProductService) { }
  @ViewChild('paginator') paginator: Paginator | undefined;

  isSidebarVisible = false;
  products: Product[] = [];
  queryParams: ProductQueryParams = {
    limit: 12,
    offset: 0
  };
  totalRecords: number = 20;

  ngOnInit() {
    this.getProducts();
  }
  getProductsWithSearch(searchText: string) {
    this.queryParams.name = searchText;
    this.getProducts();
  }
  getProducts() {
    this.productService.getAllProducts(this.queryParams).subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error) => console.log(error)
    });
  }
  onPageChange(event: any) {
    this.queryParams.offset = event.page * event.rows;
    this.queryParams.limit = event.rows;
    this.getProducts();
  }
  showSidebar() {
    this.isSidebarVisible = true;
  }
}
