package com.ali.ecommerce.controller;

import com.ali.ecommerce.entity.Users;
import com.ali.ecommerce.service.UsersServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UsersServiceImpl usersService;

    @PutMapping("/users/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users user){
        Users updatedUser = this.usersService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/users")
    public List<Users> getAllUsers(){
        return this.usersService.getAllUsers();
    }

    @PostMapping("users")
    public Users createUser(@RequestBody Users user){
        return this.usersService.createUser(user);
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id){
        this.usersService.deleteUsers(id);
        // this map will be converted to json
        //{
        //    "deleted": true
        //}
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    // get employee by id rest api
    @GetMapping("/users/{id}")
    public ResponseEntity<Users> getUsersById(@PathVariable Long id) {
        Users user = this.usersService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
