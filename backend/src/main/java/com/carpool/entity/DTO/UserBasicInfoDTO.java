package com.carpool.entity.DTO;

import lombok.Data;

@Data
public class UserBasicInfoDTO {
    private Long id;
    private String name;
    private String phoneNumber;
    private String emailAddress;
}
