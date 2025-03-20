package com.carpool.entity.DTO;

import com.carpool.entity.*;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


// 顯示給user看的event資訊
@Data
public class UserPastEventDTO {
    private Long userId;
    private Long eventId;

    private String initiatorName;
    private Date startTime;
    private boolean isSelfDrive;
    private boolean isCompleted;
    private Integer attendantNumber;
    private LocalDateTime getOnTime;
    private Location getOnLocation;
    private Location getOffLocation;
}
