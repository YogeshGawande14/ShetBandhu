package com.agroconnect.security;

import com.agroconnect.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import com.agroconnect.domain.Role;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key; private final long ttlMillis;
    public JwtService(@Value("${app.jwt.secret}") String secret,@Value("${app.jwt.ttl-ms:3600000}") long ttlMillis) { this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.ttlMillis=ttlMillis; }
    public String generate(User user) { return generate(user, user.getRole()); }
    public String generate(User user, Role activeRole) { Instant now=Instant.now(); return Jwts.builder().subject(user.getPhoneNumber()).claim("uid",user.getId().toString()).claim("role",activeRole.name()).claim("ver",user.getTokenVersion()).issuedAt(Date.from(now)).expiration(Date.from(now.plusMillis(ttlMillis))).signWith(key).compact(); }
    public String subject(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject(); }
    public boolean valid(String token) { try { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("ver", Integer.class)!=null; } catch(RuntimeException ex) { return false; } }
    public Role activeRole(String token) { try { return Role.valueOf(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("role", String.class)); } catch(RuntimeException ex) { return null; } }
    public int tokenVersion(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("ver", Integer.class); }
    public Instant expiresAt() { return Instant.now().plusMillis(ttlMillis); }
}
