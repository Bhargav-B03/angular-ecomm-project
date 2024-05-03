import { Component, OnInit } from '@angular/core';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbCarouselModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  popularProducts: undefined | Product[];
  trendyProducts: undefined | Product[];

  constructor(private productsService: ProductService){}

  ngOnInit(): void {
    this.productsService.popularProducts().subscribe((data:Product[])=>{
      this.popularProducts = data;
    })

    this.productsService.trendyProducts().subscribe((data:Product[])=>{
      this.trendyProducts = data;
    })
  }
}
