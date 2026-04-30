import { Component, inject, input, isWritableSignal, Signal, signal, WritableSignal } from '@angular/core';
import { Product } from '../../types/product';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [UpperCasePipe, CurrencyPipe, DatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {

  private productService = inject(ProductService);
  private router = inject(Router);

  product: Signal<Product | null> = signal(null);

  id = input.required<number>();

  isLoading = this.productService.isLoading;
  errorMessage = this.productService.errorMessage;

  ngOnInit() {
    this.product = this.productService.getProductById(this.id());
  }

  async deleteProduct() {
      await this.productService.deleteProduct(this.product()!.id);
      this.router.navigate(['/products']);
  }

}
