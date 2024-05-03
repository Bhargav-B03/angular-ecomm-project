import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  menuType: string = '';
  sellerName: string = '';
  searchResult: undefined | Product[];

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        if (localStorage.getItem('seller') && event.url.includes('seller')) {
          this.menuType = 'seller';
          this.sellerName = JSON.parse(localStorage.getItem('seller')!)[0].name
        }
        else {
          this.menuType = 'default';
        }
      }
    })
  }

  logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.productService.searchProducts(element.value).subscribe(result => {
        if (result.length > 5) {
          result.length = 5;
        }
        this.searchResult = result;
        console.log(this.searchResult);
      })
    }
  }

  hideResult() {
    this.searchResult = undefined;
  }

  submitSearch(val: string) {
    this.router.navigate([`search/${val}`])
  }
}
