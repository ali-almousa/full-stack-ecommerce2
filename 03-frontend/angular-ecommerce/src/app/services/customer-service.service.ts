import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Customer } from '../common/customer';


@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private baseUrl = environment.luv2shopApiUrl + '/customers';

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<Customer[]>{
    return this.httpClient.get<GetResponseCustomers>(this.baseUrl).pipe(
      map(response => response._embedded.customers)
    );
  }
}

interface GetResponseCustomers {
  _embedded: {
    customers: Customer[];
  }
}