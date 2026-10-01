package com.terruno.api.auth;

import java.time.Instant;

import com.terruno.api.config.AppProperties;
import com.terruno.api.user.User;
import com.terruno.api.user.UserResponse;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

/** Issues the signed access tokens that the resource-server filter chain validates. */
@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final AppProperties.Jwt jwtProps;

    public TokenService(JwtEncoder encoder, AppProperties props) {
        this.encoder = encoder;
        this.jwtProps = props.jwt();
    }

    public AuthResponse issue(User user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(jwtProps.ttl());
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(jwtProps.issuer())
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiresAt(expiresAt)
                .claim("email", user.getEmail())
                .claim("name", user.getFirstName())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new AuthResponse(token, expiresAt, UserResponse.from(user));
    }
}
