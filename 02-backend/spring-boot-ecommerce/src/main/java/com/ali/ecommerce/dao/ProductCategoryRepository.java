package com.ali.ecommerce.dao;

import com.ali.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

// collectionResourceRel = "productCategory" --> name of json entry
// path = "product-category" --> ref to the path (/product_category)
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
//@CrossOrigin("http://localhost:4200")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
