package com.terruno.api.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** A small Málaga winery or olive mill whose products can go in a box. */
@Entity
@Table(name = "producers")
public class Producer {

    public enum Kind {
        WINERY, OLIVE_MILL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Kind kind;

    @Column(nullable = false, length = 80)
    private String town;

    @Column(nullable = false, length = 80)
    private String area;

    @Column(nullable = false, length = 120)
    private String specialty;

    @Column(nullable = false, length = 500)
    private String description;

    protected Producer() {
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public Kind getKind() {
        return kind;
    }

    public String getTown() {
        return town;
    }

    public String getArea() {
        return area;
    }

    public String getSpecialty() {
        return specialty;
    }

    public String getDescription() {
        return description;
    }
}
