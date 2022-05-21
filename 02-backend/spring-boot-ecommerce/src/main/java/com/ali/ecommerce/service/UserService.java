package com.ali.ecommerce.service;

import com.ali.ecommerce.entity.Users;

import java.util.List;

public interface UserService {

    public Users updateUser(Long id, Users user);

    public Users createUser(Users user);

    public List<Users> getAllUsers();

    public void deleteUsers(Long id);

    public Users getUserById(Long id);
}
