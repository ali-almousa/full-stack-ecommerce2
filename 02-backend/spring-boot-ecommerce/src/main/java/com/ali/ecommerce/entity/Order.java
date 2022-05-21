package com.ali.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "order_tracking_number")
  private String orderTrackingNumber;

  @Column(name = "total_price")
  private BigDecimal totalPrice;

  @Column(name = "total_quantity")
  private int totalQuantity;

  @Column(name = "status")
  private String status;

  @Column(name = "date_created")
  @CreationTimestamp
  private Date dateCreated;

  @Column(name = "last_updated")
  @UpdateTimestamp
  private Date lastUpdated;

  // order has a collection of orderItems
  // orderItems/orderItem are/is unique thus they/it can't belong to many orders (not many2many)
  @JsonIgnore

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
  private Set<OrderItem> orderItems = new HashSet<>();

  // orders could be to one customer
  // many orders belong to only one customer
  // a customer could have many orders
  // many orders can't belong to many customers (thus it's not many2many)
  // as orders are unique and allocated to a specific customer.
  // if we delete/persist an order then do NOT delete/persist the related customer. (makes sense)
  @JsonIgnore
  @ManyToOne
  @JoinColumn(name = "customer_id")
  private Customer customer;

  // ! I do not understand exactly the reason behind choosing one2one mapping here?
  // I believe there is a good reason for defining this mapping to be one2one even though many orders could have the same
  // address... I think since we have two columns that are mapped to the address table then one2one is safer!!!
  // ! if we delete/persist an order then delete/persist the related address. Why is this true?
  // * yes this does make a sense given that the related address only existed for the deleted/persisted order (one2one)
  // ! but why we did not apply cascade all for the other side of the relation following the same logic?
  // the shipping_address_id column is defined here (order table) and is the join column
  // the referencedColumnName is the name of the column in the other table (address table) that is being referenced
  // ! why do need to explicitly specify the referenced column name here (not like normal) while it is already
  // ! referenced in the database with the sql script? maybe if we have two columns that refer to the same table then
  // ! the referenced column should be explicitly specified!
  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
  private Address shippingAddress;
  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "billing_address_id", referencedColumnName = "id")
  private Address billingAddress;

  // adding orderItem to the orderItems
  public void add(OrderItem orderItem) {
    // check orderItem not null
    if (orderItem != null) {
      // check orderItems is initailized
      if (this.orderItems == null) {
        this.orderItems = new HashSet<>();
      }
      // add orderItem to orderItems
      this.orderItems.add(orderItem);
      // add this order to orderItem
      // bidirectional relation
      orderItem.setOrder(this);
    }
  }
}
