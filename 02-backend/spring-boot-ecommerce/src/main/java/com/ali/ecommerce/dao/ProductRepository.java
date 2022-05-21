package com.ali.ecommerce.dao;

import com.ali.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

// He ignores this annotation ( how is Rest is mapping this endpoint regardless of this annotation)
@RepositoryRestResource
//@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product,Long> {

    // behind the scenes, spring data jpa will execute a query similar to this
    // SELECT * FROM product where category_id="id"
    // also spring data REST automatically exposes endpoints
    // http://localhost:8080/api/products/search/findByCategoryId?id="id"
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    // behind the scenes, spring data jpa will execute a query similar to this
    // SELECT * FROM Product p WHERE p.name LIKE CONCAT('%', :name, '%')
    Page<Product> findByNameContaining(@RequestParam("name") String name,  Pageable pageable);
}
