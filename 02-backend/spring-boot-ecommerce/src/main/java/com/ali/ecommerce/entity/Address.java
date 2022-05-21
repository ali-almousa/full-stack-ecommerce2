package com.ali.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "country")
    private String country;

    @Column(name = "zip_code")
    private String zipCode;

    // if we delete/persist an address then do not delete/persist the related order
    // ! 1- for one to one relations we have to define the relation on both sides (no use for mappedBy)?
    // * 1- I believe this is a bidirectional relation meaning: given an address we can get the order and vice versa
    // * thus we needed to redefine the relation from this side while on unidirectional relation there no need to define
    // * the relation here. Normally to define the relation on the other side we suffice by indicating that it is mappedBy
    // * another property in the related identity. However, in our case here: we wish to specify other mappings rules
    // * that's why we did not use the mappedBy and rather specified other mapping paradigm with @PrimaryKeyJoinColumn
    // ! 2- why not flip the way the relation is defined on both sides?
    // * 2- define the relation on each side as needed by the application
    // ! 3- did not understand how is this relation defined and why do we need @PrimaryKeyJoinColumn?
    // * 3- so with this annotation we are telling hibernate to update this property (order) on the base of joining the
    // * related order id with the related address id instead of joining with the shippingAddressId or billingAddressId
    // * this is only for Java use as for the database there is no column named "order" in the address table. so when I
    // * persist an address object to the database hibernate will associate this object with an id from the order table
    // * so when I fetch a record from the address table (Address object) I can access the order based on the id
    // join using primary keys
    // by default keys have same name
    // join the two tables based on the id columns on both sides
    // ! 4- an address could have many orders not only one (just like a customer can have many orders) so can we add
    // ! many orders to the same address?
    // * 4- I believe yes we can assign many orders with the same address, however, each address will be defined
    // * in a different record with a unique id but with the same data
    @OneToOne
    @PrimaryKeyJoinColumn
    private Order order;
}
