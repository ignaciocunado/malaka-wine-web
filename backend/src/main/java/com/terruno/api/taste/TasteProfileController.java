package com.terruno.api.taste;

import com.terruno.api.common.CurrentUser;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/taste-profile")
public class TasteProfileController {

    private final TasteProfileService service;
    private final CurrentUser currentUser;

    public TasteProfileController(TasteProfileService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<TasteProfileDto> get(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.of(service.find(currentUser.require(jwt)));
    }

    @PutMapping
    public TasteProfileDto save(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody TasteProfileDto body) {
        return service.save(currentUser.require(jwt), body);
    }
}
