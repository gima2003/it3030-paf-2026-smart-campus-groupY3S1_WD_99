package com.smartcampus.smart_campus_api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        String token = tokenProvider.generateToken(authentication);
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // Redirect to React frontend login page with token built into the query param
        String redirectUrl = "http://localhost:5173/login?token=" + token + "&role=" + role.replace("ROLE_", "");
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
