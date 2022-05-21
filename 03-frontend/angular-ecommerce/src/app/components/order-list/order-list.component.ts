import { Component, OnInit } from '@angular/core';
import { OrderManage } from 'src/app/common/order-manage';
import { OrderManageService } from 'src/app/services/order-manage.service';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: OrderManage[] = [];

  constructor(private orderService: OrderManageService) { }

  ngOnInit(): void {
    this.listOrders();
  }

  listOrders(): void {
    this.orderService.getOrders().subscribe(
      data =>  {this.orders = data;}
    )
  }

}
