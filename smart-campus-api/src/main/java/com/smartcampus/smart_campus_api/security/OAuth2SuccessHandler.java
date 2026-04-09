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

    @Autowired
    private com.smartcampus.smart_campus_api.repository.UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        String email = ((org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal()).getAttribute("email");
        java.util.Optional<com.smartcampus.smart_campus_api.entity.User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && Boolean.TRUE.equals(userOpt.get().getMfaEnabled())) {
            String roleStr = userOpt.get().getRole();
            if ("ADMIN".equals(roleStr) || "STUDENT".equals(roleStr) || "TECHNICIAN".equals(roleStr)) {
                String mfaToken = tokenProvider.generateMfaToken(email);
                String redirectUrl = "http://localhost:5173/login?mfaToken=" + mfaToken;
                getRedirectStrategy().sendRedirect(request, response, redirectUrl);
                return;
            }
        }

        String token = tokenProvider.generateToken(authentication);
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // Redirect to React frontend login page with token built into the query param
        String redirectUrl = "http://localhost:5173/login?token=" + token + "&role=" + role.replace("ROLE_", "");
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
