import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  // default values
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  currentCategoryName: string = "Books";
  // properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = "";
  


  // inject the current active route that loaded the component
  // useful for accessing route parameters.
  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService) { }

  ngOnInit(): void {
    // !only call listProducts when a parameter is passed
    // as we are listening.
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    // check if 'id' parameter is available
    // route: use the activated route 
    // snapshot: state of route at this given memoment in time
    // paramMap: map of all the route parameters
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the "id" param string. Convert string to a number using "+"
      // when you know the value is actually neither null nor undefined but 
      // the compiler doesn't, you can use the nun-null assertion operator, !
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      // default id if nothing is passed as param
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // check if we have a different category than previous 
    // Note: Angular will reuse a component if it is currently being viewed 

    // if we have a different category id than previous 
    // then set thePageNumber back to 1
    if (this.currentCategoryId != this.previousCategoryId){
      this.thePageNumber = 1;
    }

    // update the prev to the current as for the next time 
    // the current now will be the prev later 
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    // this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    });

  }

  // spring data rest: pages are 0 based
  // angular: pages are 1 based
  // left are properties and right are json from backend
  // processResult(){
  //   return data => {
  //     this.products = data._embedded.products;
  //     this.thePageNumber = data.page.number + 1;
  //     this.thePageSize = data.page.size;
  //     this.theTotalElements = data.page.totalElements;
  //   };
  // }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  handleSearchProducts() {
    const searchKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // if we have a different keyword than the previous
    // then set the page number to 1
    if (this.previousKeyword != searchKeyword){
      this.thePageNumber = 1;
    }

    // update the prev keyword to be the current one
    // as the current now will be the previous for the next one 
    this.previousKeyword = searchKeyword;
    console.log(`keyword=${searchKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, searchKeyword).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
        
      }
    )


  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // create an CartItem
    const theCartItem = new CartItem(theProduct);

    // call cart service
    this.cartService.addToCart(theCartItem);
  }

  showMe(p: Product){
    console.log(`Show me: ${p.id}`);
  }
}

