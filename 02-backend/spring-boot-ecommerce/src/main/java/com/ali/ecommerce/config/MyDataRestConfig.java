package com.ali.ecommerce.config;

import com.ali.ecommerce.entity.Country;
import com.ali.ecommerce.entity.Product;
import com.ali.ecommerce.entity.ProductCategory;
import com.ali.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

  private EntityManager entityManager;

  @Autowired
  public MyDataRestConfig(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Override
  public void configureRepositoryRestConfiguration(
      RepositoryRestConfiguration config, CorsRegistry cors) {
    // Http methods to disable
    HttpMethod[] theUnsupportedActions = {HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PUT};

    // disable HTTP methods for Product: PUT, POST, and DElETE
    disableHttpMethods(Product.class, config, theUnsupportedActions);

    // disable HTTP methods for ProductCategory: PUT, POST, and DElETE
    disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

    // disable HTTP methods for Countries: PUT, POST, and DElETE
    disableHttpMethods(Country.class, config, theUnsupportedActions);

    // disable HTTP methods for States: PUT, POST, and DElETE
    disableHttpMethods(State.class, config, theUnsupportedActions);

    // call an internal helper method
    exposeIds(config);
  }

  private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
    config
        .getExposureConfiguration()
        .forDomainType(theClass)
        .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)))
        .withCollectionExposure(
            ((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
  }

  public void exposeIds(RepositoryRestConfiguration config) {

    System.out.println("########## exploring ###########");
    // expose entity ids

    // - get a list of all entity classes from the entity manager
    // entities = [ProductCategory, Product]
    Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

    // - create an array of the entity types
    List<Class> entityClasses = new ArrayList<>();

    // - get the entity types for the entities
    for (EntityType tempEntityType : entities) {
      // getClass()
      // tempEntityType = class com.ali.ecommerce.entity.ProductCategory
      // tempEntityType = class com.ali.ecommerce.entity.Product
      // getJavaType()
      // tempEntityType = class com.ali.ecommerce.entity.Product
      // tempEntityType = class com.ali.ecommerce.entity.ProductCategory
      // don't know the difference, however it doesn't work with getClass().
      entityClasses.add(tempEntityType.getJavaType());
//            entityClasses.add(tempEntityType.getClass());
    }

    // expose the entity ids for the array of entity/domain types
    // domainTypes = [class com.ali.ecommerce.entity.Product, class com.ali.ecommerce.entity.ProductCategory]
    Class[] domainTypes = entityClasses.toArray(new Class[0]);
    config.exposeIdsFor(domainTypes);
  }
}
