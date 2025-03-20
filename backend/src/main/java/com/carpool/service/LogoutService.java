package com.carpool.service;

import jakarta.servlet.http.HttpServletRequest;
import  com.carpool.entity.Result;

public interface LogoutService {
    public Result logout(String token);
}
