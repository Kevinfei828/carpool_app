package com.carpool.service;
import com.carpool.entity.LoginForm;
import com.carpool.entity.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public interface RegisterService {
    public Result sendRegisterCode(LoginForm loginForm);
    public Result login(LoginForm loginForm);
//    public Result logout(HttpServletRequest request);
}
