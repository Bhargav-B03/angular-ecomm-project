import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cart, PriceSummary } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  cartData: Cart[] | undefined;
  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: string | undefined) {
    cartId && this.productService.removeFromCart(cartId).subscribe(result => {
      if (result) {
        this.loadDetails();
      }
    });
  }

  loadDetails() {
    this.productService.currentCart().subscribe(result => {
      this.cartData = result;
      console.log(result.length)
      this.productService.cartDataEmit.emit(result);
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.productPrice * +item.quantity)
        }
      })
      this.priceSummary.price = price;
      this.priceSummary.discount = price / 10;
      this.priceSummary.tax = price / 10;
      this.priceSummary.delivery = 100;
      this.priceSummary.total = this.priceSummary.price + this.priceSummary.tax + this.priceSummary.delivery - this.priceSummary.discount;
      if (!this.cartData.length) {
        this.priceSummary.total = 0;
        this.router.navigate(['/']);
      }
    })
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
