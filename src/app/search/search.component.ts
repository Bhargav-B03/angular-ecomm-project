import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchResult: undefined | Product[];

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService){}

  ngOnInit(): void {
    let query = this.activatedRoute.snapshot.paramMap.get('query');

    query && this.productService.searchProducts(query).subscribe(result=>{
      this.searchResult = result;
    })
  }
}