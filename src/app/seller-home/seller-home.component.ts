import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css'
})
export class SellerHomeComponent implements OnInit {
  productList: Product[] | undefined;
  deletionMessage: undefined | string;
  trashIcon = faTrash;
  editIcon = faPenToSquare;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(result => {
      if (result) {
        this.productList = result;
      }
    })
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe(result => {
      if (result) {
        console.log(result);
        this.deletionMessage = "Product deleted successfully";
        this.getProducts();
        setTimeout(() => {
          this.deletionMessage = undefined;
        }, 3000);
      }
    })
  }
}
