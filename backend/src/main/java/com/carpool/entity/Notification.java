package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "Notification")
public class Notification {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(name = "type", columnDefinition = "TINYINT default 1", nullable = false)
    private Integer type;

    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_read", columnDefinition = "BOOLEAN default false", nullable = false)
    private boolean isRead;
}
