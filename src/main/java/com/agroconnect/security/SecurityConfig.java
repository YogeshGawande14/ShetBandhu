package com.agroconnect.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtFilter; private final ApiSecurityErrorHandler errorHandler;
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http.csrf(c->c.disable()).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e->e.authenticationEntryPoint(errorHandler).accessDeniedHandler(errorHandler))
            .authorizeHttpRequests(a->a
            .requestMatchers("/api/auth/active-role").authenticated()
            .requestMatchers("/api/auth/logout", "/api/auth/logout-all").authenticated()
            .requestMatchers("/api/auth/**","/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html","/actuator/health").permitAll()
            .requestMatchers(HttpMethod.GET,"/api/products/mine").hasRole("SHOP_OWNER")
            .requestMatchers(HttpMethod.GET,"/api/products/**","/api/mandi-rates/**","/api/kendras/nearby","/api/kendras/search").permitAll()
            .requestMatchers(HttpMethod.GET,"/api/local-services").permitAll()
            .requestMatchers(HttpMethod.GET,"/api/products/*/reviews/**","/api/schemes/**","/api/media/**").permitAll()
            .requestMatchers(HttpMethod.POST,"/api/profit/calculate").permitAll()
            .requestMatchers(HttpMethod.POST,"/api/checkout/guest").permitAll()
            .requestMatchers(HttpMethod.GET,"/api/checkout/guest/**").permitAll()
            .requestMatchers(HttpMethod.POST,"/api/products").hasRole("SHOP_OWNER")
            .requestMatchers("/api/checkout/**").authenticated()
            .requestMatchers("/api/orders/**").authenticated().anyRequest().authenticated())
            .addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class).build();
    }
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception { return c.getAuthenticationManager(); }
}

