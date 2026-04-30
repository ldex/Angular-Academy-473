import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://671d383409103098807c943e.mockapi.io/api/products/';

  private http = inject(HttpClient);

  loadProducts(): Observable<Product[]> {
    return this
              .http
              .get<Product[]>(this.baseUrl)
              .pipe(
                delay(2000) // Simulate network delay
              );
  }

  loadProduct(id: number): Observable<Product> {
    return this
              .http
              .get<Product>(this.baseUrl + id)
              .pipe(
                delay(1000) // Simulate network delay
              );
  }

  saveProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + id);
  }

}
