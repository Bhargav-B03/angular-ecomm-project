import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Cart, Order, Product } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartDataEmit = new EventEmitter<Product[] | Cart[]>();
  existingProduct: boolean = false;

  constructor(private http: HttpClient) { }

  addProduct(data: Product) {
    return this.http.post('http://localhost:3000/products', data);
  }

  getProducts() {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  getProduct(id: string) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: Product) {
    return this.http.put(`http://localhost:3000/products/${product.id}`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`http://localhost:3000/products/${id}`)
  }

  popularProducts() {
    return this.http.get<Product[]>(`http://localhost:3000/products?_limit=3`);
  }

  trendyProducts() {
    return this.http.get<Product[]>(`http://localhost:3000/products?_limit=8`);
  }

  searchProducts(query: string) {
    return this.http.get<Product[]>(`http://localhost:3000/products?q=${query}`);
  }

  localAddToCart(data: Product) {
    let cartData: Product[] = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      cartData.push(data);
    }
    else {
      let cartItems = JSON.parse(localCart);
      cartData = cartItems.map((product: Product) => {
        if (product.id === data.id) {
          product.quantity! += data.quantity!;
          this.existingProduct = true;
          return product;
        }
        return product;
      })
      !this.existingProduct && cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.cartDataEmit.emit(cartData);
  }

  localRemoveFromCart(data: Product) {
    let cartData = []
    let localCart = localStorage.getItem('localCart');
    if (localCart) {
      cartData = JSON.parse(localCart);
      cartData = cartData.filter((item: Product) => item.id !== data.id)
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.existingProduct = false;
    }
    this.cartDataEmit.emit(cartData);
  }

  getCartItem(product: Cart) {
    return this.http.get<Cart[]>('http://localhost:3000/cart?productId=' + product.productId);
  }

  addToCart(cartData: Cart) {
    this.getCartItem(cartData).subscribe(result => {
      if (result[0]) {
        result[0].quantity! += cartData.quantity!;
        console.log(cartData.productId);

        this.http.patch('http://localhost:3000/cart/' + result[0].id, { "quantity": result[0].quantity }).subscribe(result => {
          console.log(result);
        })
      }
      else {
        this.http.post('http://localhost:3000/cart', cartData).subscribe((result) => {
          if (result) {
            this.getCartList(cartData.userId);
          }
        })
      }
    })
  }

  getCartList(userId: string) {
    return this.http.get<Cart[]>('http://localhost:3000/cart?userId=' + userId, { observe: 'response' }).subscribe(result => {
      if (result && result.body) {
        this.cartDataEmit.emit(result.body);
      }
    })
  }

  removeFromCart(cartId: string) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  currentCart() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    return this.http.get<Cart[]>('http://localhost:3000/cart?userId=' + userId);
  }

  orderNow(data: Order) {
    return this.http.post('http://localhost:3000/orders', data);
  }

  orderList() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    return this.http.get<Order[]>('http://localhost:3000/orders?userId=' + userId);
  }

  deleteCartItems(cartId: string) {
    return this.http.delete('http://localhost:3000/cart/' + cartId, { observe: 'response' }).subscribe(result => {
      this.cartDataEmit.emit([]);
    });
  }

  cancelOrder(orderId: string) {
    return this.http.delete('http://localhost:3000/orders/' + orderId);
  }
}
