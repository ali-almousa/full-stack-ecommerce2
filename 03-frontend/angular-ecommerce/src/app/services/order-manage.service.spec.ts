import { TestBed } from '@angular/core/testing';

import { OrderManageService } from './order-manage.service';

describe('OrderManageService', () => {
  let service: OrderManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
