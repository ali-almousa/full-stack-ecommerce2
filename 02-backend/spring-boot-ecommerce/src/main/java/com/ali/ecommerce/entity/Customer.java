package com.ali.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customer")
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "email")
    private String email;

    // a customer could have many orders
    // ! why we define cascaded in this side of the relation only?
    // * cascade types should be specified on each side of the relation separately according to the needs
    // if we delete/persist a customer then delete/persist the related orders. (makes sense)
    @JsonIgnore
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Order> orders = new HashSet<>();

    // add order to customer
    public void add(Order order){
        if (order != null){
            if (this.orders == null){
                this.orders = new HashSet<>();
            }
            this.orders.add(order);
            order.setCustomer(this);
        }
    }

}
