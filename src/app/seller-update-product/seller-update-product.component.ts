import { Component, OnInit } from '@angular/core';
import { Product } from '../data-type';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-seller-update-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css'
})
export class SellerUpdateProductComponent implements OnInit {
  updateProductMessage: undefined | string;
  productData: undefined | Product;

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    productId && this.productService.getProduct(productId).subscribe(data => {
      this.productData = data;
    })
  }

  submitProduct(data: Product) {
    if (this.productData) {
      data.id = this.productData.id;
    }
    this.productService.updateProduct(data).subscribe(result => {
      if (result) {
        this.updateProductMessage = "Product updated successfully"
        setTimeout(() => {
          this.updateProductMessage = undefined;
          this.router.navigate(['seller-home']);
        }, 3000);
      }
    })
  }


}
