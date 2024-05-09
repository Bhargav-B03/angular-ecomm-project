import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart, Order } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  orderMsg: string | undefined;
  cartData: Cart[] | undefined;
  totalPrice: number | undefined;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.currentCart().subscribe((result) => {

      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.productPrice * +item.quantity)
        }
      })
      this.totalPrice = price + (price / 10) + 100 - (price / 10);

      console.warn(this.totalPrice);
    })
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (this.totalPrice) {
      let orderData: Order = {
        ...data,
        userId,
        totalPrice: this.totalPrice,
        id: undefined
      }

      this.cartData?.forEach(item=>{
        setTimeout(() => {
          item.id && this.productService.deleteCartItems(item.id)
        }, 700);
      })

      this.productService.orderNow(orderData).subscribe(result => {
        if (result) {
          this.orderMsg = 'Your order has been placed successfully';
          setTimeout(() => {
            this.router.navigate(['/my-orders']);
            this.orderMsg = undefined;
          }, 4000);
        }
      })
    }
  }
}
