import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.luv2shopApiUrl + '/products';
  private categoryUrl = environment.luv2shopApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }


  getProductCategories(): Observable<ProductCategory[]> {

    // call REST API
    // maps the JSON data from spring data rest to productCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  // for pagenation 
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    
    // build URL based on the category id, page and size
    const productUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    // no need for mapping the JSON to Product manually
    // IDK why?
    return this.httpClient.get<GetResponseProducts>(productUrl);
  }
  
  
  searchProducts(theKeyword: string): Observable<Product[]> {
    
    // need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    // call REST API
    // maps the JSON data from spring data rest to productCategory array
    return this.getProducts(searchUrl);
  }
  
  // for pagenation of searching 
  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;
    // call REST API
    // maps the JSON data from spring data rest to productCategory array
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // for the ProductDetailsComponent
  getProduct(theProductId: number): Observable<Product> {
    // build URL based on the id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    // no need for mapping the JSON to Product manually
    // IDK why?
    return this.httpClient.get<Product>(productUrl);
  }

  // for product manage component 
  getAllProductList(): Observable<Product[]> {

    return this.getProducts(this.baseUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  // add support fot the metadata needed in the JSON
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

// unwraps the JSON from spring data REST using _embedded entry
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}


