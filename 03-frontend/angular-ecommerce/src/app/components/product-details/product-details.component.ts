import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  // that will be accessed in the html to render the product details
  product: Product = new Product();

  constructor(private productService: ProductService,
     private route: ActivatedRoute,
     private cartService: CartService) { }

  ngOnInit(): void {
    // !only call getProduct when there is a param
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    // het the id param string. convert it to a number 
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    // call the service to fetch the details of this product id from the rest api
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      });
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

    // create an CartItem
    const theCartItem = new CartItem(this.product);

    // call cart service
    this.cartService.addToCart(theCartItem);
  }

}
