import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-products-manage',
  templateUrl: './products-manage.component.html',
  styleUrls: ['./products-manage.component.css']
})
export class ProductsManageComponent implements OnInit {

  products : Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(): void {
    this.productService.getAllProductList().subscribe(
      data => {this.products = data;}
    )
  }

}
