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

}
