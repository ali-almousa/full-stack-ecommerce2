package com.ali.ecommerce.service;

import com.ali.ecommerce.dao.UsersRepository;
import com.ali.ecommerce.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersServiceImpl implements UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Users updateUser(Long id, Users user) {
        Users oldUser = this.usersRepository.findById(id)
                .orElseThrow();

        oldUser.setFirstName(user.getFirstName());
        oldUser.setLastName(user.getLastName());
        oldUser.setEmail(user.getEmail());

        return this.usersRepository.save(oldUser);
    }

    @Override
    public Users createUser(Users user) {
        return this.usersRepository.save(user);
    }

    @Override
    public List<Users> getAllUsers() {
        return this.usersRepository.findAll();
    }

    @Override
    public void deleteUsers(Long id) {
        Users user = this.usersRepository.findById(id)
                .orElseThrow();
        this.usersRepository.delete(user);
    }

    @Override
    public Users getUserById(Long id) {
        return this.usersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Users not exist with id :" + id));

    }
}
