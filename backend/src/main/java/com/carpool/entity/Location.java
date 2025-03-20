package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Location", uniqueConstraints = {@UniqueConstraint(columnNames = {"city_id", "name_cn"})})
public class Location {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(nullable = false, name = "name_cn")
    private String name_cn;

    @Column(name = "name_en")
    private String name_en;

}
