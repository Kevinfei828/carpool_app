package com.carpool.entity.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EventSearchDTO {
    private String startLocation;
    private String endLocation;
    private String startCity;
    private String endCity;
    private LocalDateTime startTime;
}
