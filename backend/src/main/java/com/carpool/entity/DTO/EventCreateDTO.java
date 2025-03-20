package com.carpool.entity.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EventCreateDTO {
    private Long initiatorId;
    private String eventName;
    private LocalDateTime startTime;
    private boolean isSelfDrive;
    private String startLocationName_cn;
    private String startCityName_cn;
    private String endLocationName_cn;
    private String endCityName_cn;
    private Integer maxAvailableSeat;   // 給別人搭的空位數
    private Integer attendantNumber;    // 發起人的人數
}
