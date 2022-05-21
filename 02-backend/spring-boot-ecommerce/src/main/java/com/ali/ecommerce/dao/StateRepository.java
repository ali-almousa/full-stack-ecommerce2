package com.ali.ecommerce.dao;

import com.ali.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {

    // retrieve the states for a given country code
    // states for india:
    // http://localhost:8080/api/state/search/findByCountryCode?code=IN
    // was able to join the state and country tables because of the relation
    // mapped between them. So spring REST will create the join queries and
    // fetch all stated related to a specific country code.
    // Country = table name
    // Code = column/property name
    List<State> findByCountryCode(@Param("code") String code);
}
