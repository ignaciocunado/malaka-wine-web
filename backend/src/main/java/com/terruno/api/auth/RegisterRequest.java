package com.terruno.api.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email @Size(max = 255) String email,
        // BCrypt only uses the first 72 bytes of a password.
        @NotBlank @Size(min = 8, max = 72, message = "Password must be 8–72 characters") String password,
        @NotBlank @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @AssertTrue(message = "You must be of legal drinking age (18+) to subscribe") boolean adultConfirmed) {
}
