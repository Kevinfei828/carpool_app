package com.carpool.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "City")
public class City {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_cn", nullable = false, unique = true)
    private String name_cn;

    @Column(name = "name_en")
    private String name_en;

    @OneToMany(mappedBy = "id")
    private List<Location> locations = new ArrayList<>();
}
