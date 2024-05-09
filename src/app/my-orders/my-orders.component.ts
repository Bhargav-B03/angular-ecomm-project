import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Order } from '../data-type';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  orderData: Order[] | undefined;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getOrderList();
  }

  cancelOrder(orderId: string | undefined) {
    orderId && this.productService.cancelOrder(orderId).subscribe((result) => {
      if (result) {
        this.getOrderList();
      }
    })
  }

  getOrderList() {
    this.productService.orderList().subscribe(result => {
      this.orderData = result;
    })
  }
}
