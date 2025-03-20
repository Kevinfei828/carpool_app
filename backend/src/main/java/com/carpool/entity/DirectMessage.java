package com.carpool.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectMessage {
    private Long senderId;
    private Long receiverId;
    private String content;
}
