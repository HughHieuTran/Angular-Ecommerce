import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../../types/types';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }
  link = "http://localhost:3000/";
  getAllProducts(params?: { [key: string]: any }): Observable<Products> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.get<Products>(this.link + 'product', { params: httpParams });
  }
}
