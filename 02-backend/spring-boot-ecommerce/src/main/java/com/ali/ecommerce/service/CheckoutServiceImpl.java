package com.ali.ecommerce.service;

import com.ali.ecommerce.dao.CustomerRepository;
import com.ali.ecommerce.dto.Purchase;
import com.ali.ecommerce.dto.PurchaseResponse;
import com.ali.ecommerce.entity.Customer;
import com.ali.ecommerce.entity.Order;
import com.ali.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

  private CustomerRepository customerRepository;

  // this is optional since there is only one constructor
  // @Autowired
  public CheckoutServiceImpl(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
  }

  @Override
  // since we are going to deal with some jpa stuff then:
  @Transactional
  public PurchaseResponse placeOrder(Purchase purchase) {

    // retrieve the order info from dto
    Order order = purchase.getOrder();

    // generate tracking number
    String orderTrackingNumber = generateOrderTrackingNumber();
    order.setOrderTrackingNumber(orderTrackingNumber);

    // populate order with orderItems
    Set<OrderItem> orderItems = purchase.getOrderItems();
    orderItems.forEach(item -> order.add(item));

    // populate order with billingAddress and shippingAddress
    order.setBillingAddress(purchase.getBillingAddress());
    order.setShippingAddress(purchase.getShippingAddress());

    // populate customer with order
    Customer customer = purchase.getCustomer();
    customer.add(order);

    // save to the database
    customerRepository.save(customer);

    // return a response
    return new PurchaseResponse(orderTrackingNumber);
  }

  private String generateOrderTrackingNumber() {

    // generate a random UUID number (UUID version-4)
    // probability of a duplicate in 103 trillion version-4 UUIDs is one in a billion
    // optional: to get an absolute 0% of collision I can generate a random UUID then query
    // the database to check the uniqueness of the Id, otherwise I will simply repreate the process
    // of generating and checking
    return UUID.randomUUID().toString();
  }
}
