import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Login, Product, SignUp } from '../data-type';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);

  constructor(private router: Router, private http: HttpClient, private productService: ProductService) { }

  userSignUp(userData: SignUp) {
    console.log(userData);
    this.http.post('http://localhost:3000/users', userData, { observe: 'response' }).subscribe(result => {
      console.log(result);
      localStorage.setItem('user', JSON.stringify(result.body));
      this.router.navigate(['/']);
    })
  }

  userAuthReload() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }

  userLogin(data: Login) {
    this.http.get<SignUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`, { observe: 'response' }).subscribe(result => {
      console.log(result);
      if (result && result.body && result.body.length === 1) {
        this.invalidUserAuth.emit(false);
        localStorage.setItem('user', JSON.stringify(result.body[0]));
        this.localCartToDB();
        this.router.navigate(['/'])
      }
      else {
        this.invalidUserAuth.emit(true);
      }
    })
  }

  localCartToDB() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: Product[] = JSON.parse(data);
      console.log(userId);

      cartDataList.forEach((product: Product, index) => {
        let cartData: Cart = {
          ...product,
          productId: product.id,
          userId,
        }

        delete cartData.id;
        setTimeout(() => {
          this.productService.addToCart(cartData)
          console.log("item added to DB")
          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      })
    }
    setTimeout(() => {
      this.productService.getCartList(userId);
    }, 500);
  }
}
