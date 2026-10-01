package com.terruno.api.subscription;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import com.terruno.api.catalog.Plan;
import com.terruno.api.catalog.PlanRepository;
import com.terruno.api.user.User;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Starter subscription logic: one active subscription per user, boxes ship on the 1st of each month.
 * There is no payment step yet; plug a provider (e.g. Stripe) in before {@link #subscribe} goes live.
 */
@Service
public class SubscriptionService {

    private static final ZoneId MALAGA = ZoneId.of("Europe/Madrid");

    private final SubscriptionRepository subscriptions;
    private final PlanRepository plans;
    private final Clock clock;

    public SubscriptionService(SubscriptionRepository subscriptions, PlanRepository plans) {
        this.subscriptions = subscriptions;
        this.plans = plans;
        this.clock = Clock.system(MALAGA);
    }

    @Transactional(readOnly = true)
    public Optional<SubscriptionResponse> current(User user) {
        return active(user).map(SubscriptionResponse::from);
    }

    @Transactional
    public SubscriptionResponse subscribe(User user, String planCode) {
        Plan plan = plans.findByCode(planCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown plan: " + planCode));
        Subscription subscription = active(user).orElse(null);
        if (subscription == null) {
            subscription = subscriptions.save(new Subscription(user, plan, nextBoxDate()));
        } else {
            subscription.changePlan(plan);
        }
        return SubscriptionResponse.from(subscription);
    }

    @Transactional
    public void cancel(User user) {
        active(user).ifPresent(Subscription::cancel);
    }

    private Optional<Subscription> active(User user) {
        return subscriptions.findFirstByUserIdAndStatus(user.getId(), Subscription.Status.ACTIVE);
    }

    private LocalDate nextBoxDate() {
        return LocalDate.now(clock).plusMonths(1).withDayOfMonth(1);
    }
}
