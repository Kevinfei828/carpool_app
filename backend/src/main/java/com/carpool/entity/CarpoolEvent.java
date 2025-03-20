package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class CarpoolEvent {
    @EmbeddedId
    private CarpoolEventKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "attendant_id")
    private User attendant;

    @ManyToOne
    @MapsId("eventId")
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "attendant_number", columnDefinition = "TINYINT default 1", nullable = false)
    private Integer attendantNumber;

    @Column(name = "get_on_time", nullable = false)
    private LocalDateTime getOnTime;

    @ManyToOne
    @JoinColumn(name = "get_on_location", nullable = false)
    private Location getOnLocation;

    @ManyToOne
    @JoinColumn(name = "get_off_location", nullable = false)
    private Location getOffLocation;

}
