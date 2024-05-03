import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../data-type';
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

  constructor(private activeRoute: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');

    productId && this.productService.getProduct(productId).subscribe((result) => {
      this.productData = result;
    })
  }
}
