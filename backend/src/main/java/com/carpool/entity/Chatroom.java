package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Chatroom")
public class Chatroom {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "is_closed", columnDefinition = "BOOLEAN default false", nullable = false)
    private boolean isClosed;

    @Column(name = "is_event_chatroom", columnDefinition = "BOOLEAN", nullable = false)
    private boolean isEventChatroom;

    @OneToMany(mappedBy = "chatroom", orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<UserChatroom> userChatrooms = new ArrayList<>();

    @OneToMany(mappedBy = "chatroom", orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Message> messages = new ArrayList<>();

    @OneToOne(mappedBy = "chatroom")
    private Event event;

}
