package com.carpool.entity;

import lombok.Data;

@Data
public class LoginForm {
    private String phone;
    private String verifyCode;
}
