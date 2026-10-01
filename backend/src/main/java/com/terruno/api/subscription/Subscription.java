package com.terruno.api.subscription;

import java.time.Instant;
import java.time.LocalDate;

import com.terruno.api.catalog.Plan;
import com.terruno.api.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    public enum Status {
        ACTIVE, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "next_box_date")
    private LocalDate nextBoxDate;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    protected Subscription() {
    }

    public Subscription(User user, Plan plan, LocalDate nextBoxDate) {
        this.user = user;
        this.plan = plan;
        this.status = Status.ACTIVE;
        this.startedAt = Instant.now();
        this.nextBoxDate = nextBoxDate;
    }

    void changePlan(Plan newPlan) {
        this.plan = newPlan;
    }

    void cancel() {
        this.status = Status.CANCELLED;
        this.cancelledAt = Instant.now();
        this.nextBoxDate = null;
    }

    public Plan getPlan() {
        return plan;
    }

    public Status getStatus() {
        return status;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public LocalDate getNextBoxDate() {
        return nextBoxDate;
    }
}
