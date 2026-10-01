package com.terruno.api.subscription;

import java.time.Instant;
import java.time.LocalDate;

public record SubscriptionResponse(String planCode, String planName, int priceCents, Subscription.Status status,
                                   Instant startedAt, LocalDate nextBoxDate) {

    static SubscriptionResponse from(Subscription s) {
        return new SubscriptionResponse(s.getPlan().getCode(), s.getPlan().getName(), s.getPlan().getPriceCents(),
                s.getStatus(), s.getStartedAt(), s.getNextBoxDate());
    }
}
