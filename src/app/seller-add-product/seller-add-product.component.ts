import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent {
  addProductMessage: string | undefined;

  constructor(private productService: ProductService, private router: Router){}

  submitProduct(data: Product){
    this.productService.addProduct(data).subscribe(result=>{
      if(result){ 
        this.addProductMessage = 'Your product is successfully added !';
        setTimeout(() => {
          this.addProductMessage = undefined;
          this.router.navigate(['seller-home']);
        }, 3000);
      }
    });
  }
}
