package com.ali.ecommerce.dao;

import com.ali.ecommerce.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface UsersRepository extends JpaRepository<Users, Long> {

}
