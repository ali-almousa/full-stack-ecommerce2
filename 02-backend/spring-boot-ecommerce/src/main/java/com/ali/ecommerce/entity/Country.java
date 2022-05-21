package com.ali.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "country")
@Getter
@Setter
public class Country {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private int id;

  @Column(name = "code")
  private String code;

  @Column(name = "name")
  private String name;

  @OneToMany(mappedBy = "country")
  // this annotation from jaxson will help us ignore this field when
  // providing the json data through the REST api
  @JsonIgnore
  private List<State> states;
}
