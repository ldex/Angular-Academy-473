import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Product } from '../../types/product';
import { CurrencyPipe, JsonPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ProductDetails } from "../product-details/product-details";
import { ProductService } from '../product';
import { OrderByPipe } from '../orderBy.pipe';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, UpperCasePipe, OrderByPipe, JsonPipe, SlicePipe, ProductDetails],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  private productService = inject(ProductService);


  pageSize = signal(5);
  start = signal(0);
  end = signal(this.pageSize());
  pageNumber = signal(1);

  changePage(increment: number): void {
    this.start.update((start) => start + increment * this.pageSize());
    this.end.set(this.start() + this.pageSize());
    this.pageNumber.update((pageNumber) => pageNumber + increment);
    this.selectedProduct.set(null);
  }

  isLoading = this.productService.isLoading;
  errorMessage = this.productService.errorMessage;
  title: WritableSignal<string> = signal('Products');

  selectedProduct: WritableSignal<Product | null> = signal(null);

  select(product: Product) {
    this.selectedProduct.set(product);
  }

  products: Signal<Product[]> = this.productService.getProducts();
}
