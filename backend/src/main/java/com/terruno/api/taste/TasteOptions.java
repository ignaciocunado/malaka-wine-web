package com.terruno.api.taste;

/** Allowed answers for the taste questionnaire. Stored by name, so only ever append new values. */
public final class TasteOptions {

    private TasteOptions() {
    }

    public enum WineStyle { RED, WHITE, ROSE, SWEET, SPARKLING }

    public enum WineSweetness { DRY, OFF_DRY, SWEET }

    /** Matches the fruity / bitter / pungent intensity used in EVOO tasting panels. */
    public enum OilIntensity { DELICATE, MEDIUM, ROBUST }

    /** Olive varieties grown across the province (Hojiblanca and Verdial are the local stars). */
    public enum OliveVariety { HOJIBLANCA, VERDIAL, PICUAL, ARBEQUINA, LECHIN }

    public enum OilUse { DRESSING, COOKING, FINISHING, BREAD }

    public enum DeliveryFrequency { MONTHLY, BIMONTHLY }
}
