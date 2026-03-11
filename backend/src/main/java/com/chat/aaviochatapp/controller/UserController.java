package com.chat.aaviochatapp.controller;

import com.chat.aaviochatapp.model.User;
import com.chat.aaviochatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired private UserService userService;

    @GetMapping
    public List<User> getAllUsers() { return userService.getAllUsers(); }

    @PutMapping("/{userId}/status")
    public User updateStatus(@PathVariable String userId, @RequestParam String status) {
        return userService.updateStatus(userId, status);
    }
}