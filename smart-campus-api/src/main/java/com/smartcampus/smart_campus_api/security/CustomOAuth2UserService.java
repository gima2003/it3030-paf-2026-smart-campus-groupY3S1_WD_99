package com.smartcampus.smart_campus_api.security;

import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");

        if (email == null) {
            throw new OAuth2AuthenticationException(new OAuth2Error("missing_email"), "Email not provided by Google");
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("user_not_found"), "Email not registered in the system");
        }
        
        User user = userOptional.get();

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new OAuth2AuthenticationException(new OAuth2Error("user_inactive"), "User account is inactive");
        }

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase());

        return new DefaultOAuth2User(Collections.singletonList(authority), attributes, "email");
    }
}
