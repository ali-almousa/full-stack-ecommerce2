import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OrderManage } from '../common/order-manage';


@Injectable({
  providedIn: 'root'
})
export class OrderManageService {
  private baseUrl = environment.luv2shopApiUrl + '/orders';


  constructor(private httpClient: HttpClient) { }

  getOrders(): Observable<OrderManage[]>{
    return this.httpClient.get<GetResponseOrders>(this.baseUrl).pipe(
      map(response => response._embedded.orders)
    );
  }

}


interface GetResponseOrders {
  _embedded: {
    orders: OrderManage[];
  }
}