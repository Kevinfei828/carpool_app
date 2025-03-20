package com.carpool.controller;

import com.carpool.entity.Result;
import com.carpool.entity.DTO.UserUpdateDTO;
import com.carpool.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/update")
    public Result updateUserInfo(@RequestBody UserUpdateDTO updatedUser) {
        return Result.success(userService.updateUser(updatedUser));
    }

    @GetMapping("/{userId}")
    public Result getUserBasicInfo(@PathVariable Long userId) {
        return Result.success(userService.getUserBasicInfo(userId));
    }

    @GetMapping("/past-event/{userid}")
    public Result getUserPastEvent(@PathVariable Long userId) {
        return Result.success(userService.getUserPastEvent(userId));
    }

}
