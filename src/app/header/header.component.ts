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
  userName: string = '';
  searchResult: undefined | Product[];
  cartItems: number = 0;

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        if (localStorage.getItem('seller') && event.url.includes('seller')) {
          this.menuType = 'seller';
          this.sellerName = JSON.parse(localStorage.getItem('seller')!)[0].name
        }
        if (localStorage.getItem('user')) {
          this.menuType = 'user';
          this.userName = JSON.parse(localStorage.getItem('user')!).name
        }
        else {
          this.menuType = 'default';
        }
      }
    })

    let localCart = localStorage.getItem('localCart');
    if (localCart) {
      this.cartItems = JSON.parse(localCart).length;
    }
    this.productService.cartDataEmit.subscribe(result => {
      this.cartItems = result.length;
    })
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    this.productService.getCartList(userId);
  }

  logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }

  userLogOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/user-auth']);
    this.productService.cartDataEmit.emit([]);
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
