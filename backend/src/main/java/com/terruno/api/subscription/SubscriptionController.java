package com.terruno.api.subscription;

import com.terruno.api.common.CurrentUser;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    public record SubscribeRequest(@NotBlank String planCode) {
    }

    private final SubscriptionService service;
    private final CurrentUser currentUser;

    public SubscriptionController(SubscriptionService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<SubscriptionResponse> current(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.of(service.current(currentUser.require(jwt)));
    }

    /** Starts a subscription, or switches the active one to another plan. */
    @PutMapping
    public SubscriptionResponse subscribe(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody SubscribeRequest body) {
        return service.subscribe(currentUser.require(jwt), body.planCode());
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@AuthenticationPrincipal Jwt jwt) {
        service.cancel(currentUser.require(jwt));
    }
}
