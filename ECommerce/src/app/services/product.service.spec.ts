import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { Products } from '../../types/types';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockLink = 'http://localhost:3000/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('getAllProducts', () => {
    it('should return an Observable<Products> without params', () => {
      const dummyProducts: Products = {
        products: [
          { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' },
          { id: 2, name: 'Product 2', price: 150, stock: 5, category: 'shirt' }
        ],
        total: 2
      };

      service.getAllProducts().subscribe(products => {
        expect(products).toEqual(dummyProducts);
      });

      const req = httpMock.expectOne(`${mockLink}product`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyProducts);
    });

    it('should return an Observable<Products> with params', () => {
      const dummyProducts: Products = {
        products: [
          { id: 1, name: 'Product 1', price: 100, stock: 10, category: 'shirt' }
        ],
        total: 1
      };

      const params = { search: 'Product 1', maxPrice: 150 };
      const httpParams = new HttpParams()
        .set('search', 'Product 1')
        .set('maxPrice', '150');

      service.getAllProducts(params).subscribe(products => {
        expect(products).toEqual(dummyProducts);
      });

      const req = httpMock.expectOne((req) => {
        return req.url === `${mockLink}product` && req.params.toString() === httpParams.toString();
      });
      expect(req.request.method).toBe('GET');
      req.flush(dummyProducts);
    });
  });


});
