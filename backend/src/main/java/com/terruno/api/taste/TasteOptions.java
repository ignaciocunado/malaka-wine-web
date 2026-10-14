package com.terruno.api.taste;

/** Allowed answers for the taste questionnaire. Stored by name, so only ever append new values. */
public final class TasteOptions {

    private TasteOptions() {
    }

    public enum WineStyle { RED, WHITE, ROSE, SWEET, SPARKLING }

    public enum WineSweetness { DRY, OFF_DRY, SWEET }

    public enum DeliveryFrequency { MONTHLY, BIMONTHLY }
}
