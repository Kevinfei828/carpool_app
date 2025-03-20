package com.carpool.entity.DTO;

import lombok.Data;

@Data
public class UserLoginDTO {
    private Long userId;
    private String token;
}
