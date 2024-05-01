import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { SignUp } from '../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-auth.component.html',
  styleUrl: './seller-auth.component.css'
})
export class SellerAuthComponent implements OnInit {
  showLogin = false;
  authError: string = '';

  constructor(private sellerService: SellerService) { }

  ngOnInit() {
    this.sellerService.reloadSeller();
  }

  signUp(data: SignUp): void {
    this.sellerService.userSignUp(data);
  }

  login(data: SignUp): void {
    this.authError = '';
    this.sellerService.userLogin(data);
    this.sellerService.isLoginError.subscribe(error => {
      if (error) {
        this.authError = 'Either email or password is incorrect'
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
