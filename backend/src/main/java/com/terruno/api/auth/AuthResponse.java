package com.terruno.api.auth;

import java.time.Instant;

import com.terruno.api.user.UserResponse;

public record AuthResponse(String token, Instant expiresAt, UserResponse user) {
}
