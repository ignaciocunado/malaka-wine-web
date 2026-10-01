package com.terruno.api.taste;

import java.time.Instant;
import java.util.Set;

import com.terruno.api.catalog.ProductType;
import com.terruno.api.taste.TasteOptions.DeliveryFrequency;
import com.terruno.api.taste.TasteOptions.OilIntensity;
import com.terruno.api.taste.TasteOptions.OilUse;
import com.terruno.api.taste.TasteOptions.OliveVariety;
import com.terruno.api.taste.TasteOptions.WineStyle;
import com.terruno.api.taste.TasteOptions.WineSweetness;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** The answers from the taste questionnaire. {@code updatedAt} is ignored on input. */
public record TasteProfileDto(
        @NotNull ProductType productPreference,
        @NotNull Set<@NotNull WineStyle> wineStyles,
        @Min(1) @Max(5) int wineBody,
        @NotNull WineSweetness wineSweetness,
        @Min(1) @Max(5) int adventurousness,
        @NotNull OilIntensity oilIntensity,
        @NotNull Set<@NotNull OliveVariety> oliveVarieties,
        @NotNull Set<@NotNull OilUse> oilUses,
        @Min(2) @Max(6) int bottlesPerBox,
        @NotNull DeliveryFrequency deliveryFrequency,
        @Min(20) @Max(300) int monthlyBudgetEur,
        @Size(max = 1000) String notes,
        Instant updatedAt) {
}
