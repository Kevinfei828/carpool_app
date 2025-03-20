package com.carpool.entity.DTO;

import lombok.Data;

@Data
public class LocationCreateDTO {
    private Long cityId;
    private String name_cn;
    private String name_en;
}
