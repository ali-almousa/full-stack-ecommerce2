import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/common/customer';
import { CustomerServiceService } from 'src/app/services/customer-service.service';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];

  constructor(private customerService: CustomerServiceService) { }

  ngOnInit(): void {
    this.listCutomers();
  }

  listCutomers(): void {
    this.customerService.getCustomers().subscribe(
      data =>  {this.customers = data;}
    )
  }

}
