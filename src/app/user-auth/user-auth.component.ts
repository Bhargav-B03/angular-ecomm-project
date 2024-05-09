import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart, Product, SignUp } from '../data-type';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})

export class UserAuthComponent implements OnInit {
  showLogin: boolean = false;
  authError: string = ''

  constructor(private userService: UserService, private productService: ProductService) { }

  ngOnInit(): void {
    this.userService.userAuthReload();
  }

  signUp(formData: SignUp) {
    this.userService.userSignUp(formData);
  }

  login(formData: SignUp) {
    this.userService.userLogin(formData);
    this.userService.invalidUserAuth.subscribe(result => {
      if (result) {
        this.authError = 'Please enter valid details in the form';
      }
      else {
        this.authError = '';
      }
    })
  }

  openSignUp() {
    this.showLogin = false;
  }

  openLogin() {
    this.showLogin = true;
  }
}