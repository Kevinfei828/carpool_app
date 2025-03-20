package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Event")
public class Event {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "initiator_id", nullable = false)
    private User initiator;

    @Column(name = "event_name", nullable = false)
    private String eventName;  // 給發起者設定，如未設定用uuid生成隨機name

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "is_self_drive", columnDefinition = "BOOLEAN default true", nullable = false)
    private boolean isSelfDrive;

    @ManyToOne
    @JoinColumn(name = "start_location_id", nullable = false)
    private Location startLocation;

    @ManyToOne
    @JoinColumn(name = "start_city_id", nullable = false)
    private City startCity;

    @ManyToOne
    @JoinColumn(name = "end_location_id", nullable = false)
    private Location endLocation;

    @ManyToOne
    @JoinColumn(name = "end_city_id", nullable = false)
    private City endCity;

    // event的最大空位數
    // redis緩存目前的剩餘空位數
    @Column(name = "max_available_seat", columnDefinition = "TINYINT", length = 4, nullable = false)
    private Integer maxAvailableSeat;

    @Column(name = "current_available_seat", columnDefinition = "TINYINT", length = 4, nullable = false)
    private Integer currentAvailableSeat;

    @Column(name = "is_completed", columnDefinition = "BOOLEAN default false")
    @ColumnDefault("false")
    private boolean isCompleted;

    @Column(name = "is_dismissed", columnDefinition = "BOOLEAN default false")
    @ColumnDefault("false")
    private boolean isDismissed;

    @OneToMany(mappedBy = "event", orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)   // from hibernate -> foreign key on delete cascade
    private List<CarpoolEvent> carpoolEvents = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name = "event_chatroom",
        joinColumns = { @JoinColumn(name = "event_id", referencedColumnName = "id")},
        inverseJoinColumns = { @JoinColumn(name = "chatroom_id", referencedColumnName = "id") }
    )
    private Chatroom chatroom;
}
