package com.carpool.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Embeddable
public class UserChatroomKey implements Serializable {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "chatroom_id")
    private Long chatroomId;
}
