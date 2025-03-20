package com.carpool.entity.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventJoinDTO {
    private Long userId;
    private Long eventId;
    private Integer attendantNumber;
    private LocalDateTime getOnTime;
    private String getOnCity;
    private String getOffCity;
    private String getOnLocation;
    private String getOffLocation;
}
