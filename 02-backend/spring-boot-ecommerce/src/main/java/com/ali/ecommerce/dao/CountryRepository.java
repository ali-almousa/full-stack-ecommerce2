package com.ali.ecommerce.dao;

import com.ali.ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
@CrossOrigin("http://localhost:4200")
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
