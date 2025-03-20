package com.carpool.entity.DTO;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private Long id;
    private String name;
    private String emailAddress;
    private String password;
}
