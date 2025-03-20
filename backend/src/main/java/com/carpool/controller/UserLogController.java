package com.carpool.controller;


import com.carpool.Utils.RedisUtils;
import com.carpool.entity.LoginForm;
import com.carpool.exception.CustomException;
import com.carpool.exception.CustomExceptionResult;
import com.carpool.service.LogoutService;
import com.carpool.service.RegisterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.carpool.entity.Result;

@Slf4j
@RestController
public class UserLogController {
    @Autowired
    private RegisterService registerService;
    @Autowired
    private LogoutService logoutService;
    @PostMapping("/login")
    public Result login(@RequestBody LoginForm loginForm) throws Exception {
        Result res = registerService.login(loginForm);
        if (res.getCode() == 1) {
            throw new CustomException(CustomExceptionResult.BAD_REQUEST);
        }
        return res;
    }
    @PostMapping("/login/verification-code")
    public Result getverificationcode(@RequestBody LoginForm loginForm) {
        return registerService.sendRegisterCode(loginForm);
    }

    @DeleteMapping("/logout")
    public Result logout(HttpServletRequest request) {
        String token = request.getHeader("authorization");
        String loginToken = RedisUtils.LOGIN_USER_KEY + token;

        return logoutService.logout(loginToken);
    }


}
