import { inject, Injectable, Signal, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { Product } from '../types/product';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiService = inject(ApiService);
  private products = signal<Product[]>([]);
  private selectedProduct = signal<Product | null>(null);
  private loading = signal(false);
  isLoading = this.loading.asReadonly();
  private error = signal<string | undefined>(undefined);
  errorMessage = this.error.asReadonly();

  private loadProducts() {
    this.loading.set(true);
    this.apiService.loadProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => this.handleError(error, 'Failed to load products. Please try again later.'),
    });
  }

  getProducts(): Signal<Product[]> {
    if (this.products() === undefined || this.products().length === 0) {
      this.loadProducts();
    }
    return this.products.asReadonly();
  }

  private handleError(httpError: HttpErrorResponse, userMessage: string) {
    this.loading.set(false);
    let logMessage: string;
    if (httpError.error instanceof ErrorEvent) {
      logMessage = 'An error occurred:' + httpError.error.message;
    } else {
      logMessage = `Backend returned code ${httpError.status}, body was: ${httpError.error}`;
    }
    console.error(logMessage);
    this.error.set(userMessage);

    //setTimeout(() => this.error.set(undefined), 3000); // Clear after 3 seconds
  }

  getProductById(id: number): Signal<Product | null> {
    const product = this.products().find((p) => p.id === id);

    if (!product) {
      this.loadProduct(id);
    } else {
      this.selectedProduct.set(product);
    }

    return this.selectedProduct.asReadonly();
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.apiService.loadProduct(id).subscribe({
      next: (product) => {
        this.loading.set(false);
        this.selectedProduct.set(product);
      },
      error: (err) => this.handleError(err, 'Failed to load product.'),
    });
  }

  async saveProduct(newProduct: Omit<Product, 'id'>): Promise<boolean> {
    try {
      const productSaved = await firstValueFrom(this.apiService.saveProduct(newProduct));
      this.products.update((products) => [...products, productSaved]);
      console.log('Product saved on the server with id: ' + productSaved.id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteProduct(id: number): Promise<void>  {
    try {
      await firstValueFrom(this.apiService.deleteProduct(id));
      this.products.update(products => products.filter(p => p.id !== id));
      console.log('Product deleted');
    } catch (error) {
      this.handleError(error as HttpErrorResponse, 'Failed to delete product.');
      throw error;
    }
  }
}
