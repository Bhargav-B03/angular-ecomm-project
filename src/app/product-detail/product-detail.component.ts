import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cart, Product } from '../data-type';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export class ProductDetailComponent implements OnInit {
  productData: undefined | Product;
  productQuantity: number = 1;
  removeItem: boolean = false;
  cartData: Product | Cart | undefined;

  constructor(private activeRoute: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');

    productId && this.productService.getProduct(productId).subscribe((result) => {
      this.productData = result;

      let cartData = localStorage.getItem('localCart');
      if (cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: Product) => productId === item.id)
        console.log(items)
        if (items.length === 1) {
          this.removeItem = true;
        }
        else {
          this.removeItem = false;
        }
      }

      let user = localStorage.getItem('user');
      if (user) {
        let userId = user && JSON.parse(user).id;
        this.productService.getCartList(userId);
        this.productService.cartDataEmit.subscribe(result => {
          let item = result.filter((item) => productId === item.productId)
          if (item.length) {
            this.cartData = item[0];
            this.removeItem = true;
          }
        })
      }
    })
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.productService.localAddToCart(this.productData);
        this.removeItem = true;
      }
      else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: Cart = {
          ...this.productData,
          userId,
          productId: this.productData.id
        }
        delete cartData.id;
        this.productService.addToCart(cartData);

        this.productService.getCartList(userId);
        this.removeItem = true;

      }
      this.productQuantity = 1;
    }
  }

  removeFromCart() {
    if (this.productData) {
      if (!localStorage.getItem('user')) {
        this.productService.localRemoveFromCart(this.productData);
        this.removeItem = this.productService.existingProduct;
      }
      else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        this.cartData && this.productService.removeFromCart(this.cartData.id!).subscribe(result => {
          if (result) {
            this.productService.getCartList(userId);
          }
        });
      }
    }
    this.removeItem = false;
    this.productQuantity = 1;
  }
}
