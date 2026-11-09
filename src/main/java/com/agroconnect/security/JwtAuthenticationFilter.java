package com.agroconnect.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Component @RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwt; private final AgroUserDetailsService userDetails;
    @Override protected boolean shouldNotFilter(HttpServletRequest request) {
        // The public marketplace listing endpoint must work even when a browser
        // still has an expired bearer token. Private routes remain authenticated.
        return "GET".equalsIgnoreCase(request.getMethod())
                && "/api/local-services".equals(request.getServletPath());
    }
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
        String h=request.getHeader("Authorization");
        if(h!=null&&h.startsWith("Bearer ")&&SecurityContextHolder.getContext().getAuthentication()==null) {
            String token=h.substring(7);
            if(jwt.valid(token)) {
                try {
                    var account=userDetails.loadDomainUser(jwt.subject(token));
                    String activeRole=jwt.activeRole(token)==null?null:jwt.activeRole(token).name();
                    boolean roleAllowed = activeRole != null && (account.getRoles().stream().anyMatch(role->role.name().equals(activeRole))
                            || ("FARMER".equals(activeRole) && (account.getRoles().contains(com.agroconnect.domain.Role.SHOP_OWNER) || account.getRoles().contains(com.agroconnect.domain.Role.SUPER_ADMIN))));
                    if(account.isAccountEnabled() && jwt.tokenVersion(token)==account.getTokenVersion() && roleAllowed) {
                        UserDetails user=userDetails.loadUserByUsername(jwt.subject(token));
                        var authorities=new java.util.ArrayList<SimpleGrantedAuthority>();
                        authorities.add(new SimpleGrantedAuthority("ROLE_"+activeRole));
                        if(account.getRoles().contains(com.agroconnect.domain.Role.SUPER_ADMIN)) authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
                        var auth=new UsernamePasswordAuthenticationToken(user,null,authorities);
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                } catch (UsernameNotFoundException ignored) { SecurityContextHolder.clearContext(); }
            }
        }
        chain.doFilter(request,response);
    }
}
