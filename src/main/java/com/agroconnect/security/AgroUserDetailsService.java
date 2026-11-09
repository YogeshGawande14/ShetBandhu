package com.agroconnect.security;

import com.agroconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AgroUserDetailsService implements UserDetailsService {
    private final UserRepository users;
    public com.agroconnect.domain.User loadDomainUser(String phone) { return users.findByPhoneNumber(phone).orElseThrow(()->new UsernameNotFoundException("User not found")); }
    @Override public UserDetails loadUserByUsername(String phone) { var u=users.findByPhoneNumber(phone).orElseThrow(()->new UsernameNotFoundException("User not found"));return User.withUsername(u.getPhoneNumber()).password(u.getPasswordHash()).disabled(!u.isAccountEnabled()).authorities(u.getRoles().stream().map(role->"ROLE_"+role.name()).toArray(String[]::new)).build(); }
}
