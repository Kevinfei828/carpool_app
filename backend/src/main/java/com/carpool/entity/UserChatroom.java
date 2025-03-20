package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class UserChatroom {
    @EmbeddedId
    private UserChatroomKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("chatroomId")
    @JoinColumn(name = "chatroom_id")
    private Chatroom chatroom;

    @Column(name = "join_chatroom_time", nullable = false)
    private LocalDateTime joinChatroomTime;

}
