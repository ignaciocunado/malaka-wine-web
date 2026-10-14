package com.terruno.api.taste;

import java.time.Instant;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;

import com.terruno.api.taste.TasteOptions.DeliveryFrequency;
import com.terruno.api.taste.TasteOptions.WineStyle;
import com.terruno.api.taste.TasteOptions.WineSweetness;
import com.terruno.api.user.User;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "taste_profiles")
public class TasteProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ElementCollection
    @CollectionTable(name = "taste_profile_wine_styles", joinColumns = @JoinColumn(name = "taste_profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "wine_style", nullable = false, length = 20)
    private Set<WineStyle> wineStyles = new HashSet<>();

    @Column(name = "wine_body", nullable = false)
    private int wineBody;

    @Enumerated(EnumType.STRING)
    @Column(name = "wine_sweetness", nullable = false, length = 20)
    private WineSweetness wineSweetness;

    @Column(nullable = false)
    private int adventurousness;

    @Column(name = "bottles_per_box", nullable = false)
    private int bottlesPerBox;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_frequency", nullable = false, length = 20)
    private DeliveryFrequency deliveryFrequency;

    @Column(name = "monthly_budget_eur", nullable = false)
    private int monthlyBudgetEur;

    @Column(length = 1000)
    private String notes;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected TasteProfile() {
    }

    public TasteProfile(User user) {
        this.user = user;
    }

    void apply(TasteProfileDto dto) {
        wineStyles = dto.wineStyles().isEmpty() ? EnumSet.noneOf(WineStyle.class) : EnumSet.copyOf(dto.wineStyles());
        wineBody = dto.wineBody();
        wineSweetness = dto.wineSweetness();
        adventurousness = dto.adventurousness();
        bottlesPerBox = dto.bottlesPerBox();
        deliveryFrequency = dto.deliveryFrequency();
        monthlyBudgetEur = dto.monthlyBudgetEur();
        notes = dto.notes() == null || dto.notes().isBlank() ? null : dto.notes().trim();
        updatedAt = Instant.now();
    }

    TasteProfileDto toDto() {
        return new TasteProfileDto(Set.copyOf(wineStyles), wineBody, wineSweetness, adventurousness, bottlesPerBox,
                deliveryFrequency, monthlyBudgetEur, notes, updatedAt);
    }
}
