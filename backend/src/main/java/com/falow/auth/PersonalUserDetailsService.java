package com.falow.auth;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PersonalUserDetailsService implements UserDetailsService {
    private final AuthProperties properties;

    public PersonalUserDetailsService(AuthProperties properties) {
        this.properties = properties;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (properties.getUsername() == null || properties.getUsername().isBlank()
                || properties.getPasswordHash() == null || properties.getPasswordHash().isBlank()
                || !properties.getUsername().equals(username)) {
            throw new UsernameNotFoundException("Personal Falow user is not configured");
        }
        return User.withUsername(properties.getUsername())
                .password(properties.getPasswordHash())
                .roles("STUDENT")
                .build();
    }
}
