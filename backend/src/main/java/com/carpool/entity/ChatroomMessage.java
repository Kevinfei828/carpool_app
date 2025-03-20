package com.carpool.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatroomMessage {
    private Long eventId;
    private Long senderId;
    private String content;
}