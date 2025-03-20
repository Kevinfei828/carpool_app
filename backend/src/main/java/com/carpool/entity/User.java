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
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;  // 由user自己設置，如user未設置，則產生隨機string

    @Column(name = "password")
    private String password;

    @Column(nullable = false, name = "phone_number")     // 手機認證
    private String phoneNumber;

    @Column(name = "email_address")
    private String emailAddress;

    @OneToMany(mappedBy = "attendant")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<CarpoolEvent> carpoolEvents = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<UserChatroom> userChatrooms = new ArrayList<>();

    @OneToMany(mappedBy = "receiver")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Notification> notifications = new ArrayList<>();

}
