package com.smartcampus.smart_campus_api.controller;

import com.smartcampus.smart_campus_api.entity.User;
import com.smartcampus.smart_campus_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @Autowired
    private com.smartcampus.smart_campus_api.security.JwtTokenProvider tokenProvider;

    @GetMapping("/mfa/setup")
    public ResponseEntity<?> setupMfa(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

            dev.samstevens.totp.secret.SecretGenerator secretGenerator = new dev.samstevens.totp.secret.DefaultSecretGenerator();
            String secret = secretGenerator.generate();

            dev.samstevens.totp.qr.QrData data = new dev.samstevens.totp.qr.QrData.Builder()
                .label(userOpt.get().getEmail())
                .secret(secret)
                .issuer("Smart Campus")
                .algorithm(dev.samstevens.totp.code.HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

            dev.samstevens.totp.qr.QrGenerator generator = new dev.samstevens.totp.qr.ZxingPngQrGenerator();
            byte[] imageData = generator.generate(data);
            String mimeType = generator.getImageMimeType();
            String dataUri = dev.samstevens.totp.util.Utils.getDataUriForImage(imageData, mimeType);

            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("secret", secret);
            response.put("qrCode", dataUri);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error setting up MFA: " + e.getMessage());
        }
    }

    @PostMapping("/mfa/enable")
    public ResponseEntity<?> enableMfa(@RequestBody java.util.Map<String, String> payload, Authentication authentication) {
        try {
            String code = payload.get("code");
            String secret = payload.get("secret");

            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

            dev.samstevens.totp.time.TimeProvider timeProvider = new dev.samstevens.totp.time.SystemTimeProvider();
            dev.samstevens.totp.code.CodeGenerator codeGenerator = new dev.samstevens.totp.code.DefaultCodeGenerator();
            dev.samstevens.totp.code.CodeVerifier verifier = new dev.samstevens.totp.code.DefaultCodeVerifier(codeGenerator, timeProvider);

            if (verifier.isValidCode(secret, code)) {
                User user = userOpt.get();
                user.setMfaEnabled(true);
                user.setMfaSecret(secret);
                userRepository.save(user);
                return ResponseEntity.ok("MFA Enabled successfully");
            } else {
                return ResponseEntity.status(400).body("Invalid 2FA code");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error enabling MFA: " + e.getMessage());
        }
    }

    @PostMapping("/mfa/verify")
    public ResponseEntity<?> verifyMfa(@RequestBody java.util.Map<String, String> payload, Authentication authentication) {
        try {
            String code = payload.get("code");
            
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

            User user = userOpt.get();
            if (!Boolean.TRUE.equals(user.getMfaEnabled())) {
                return ResponseEntity.badRequest().body("MFA is not enabled for this user");
            }

            dev.samstevens.totp.time.TimeProvider timeProvider = new dev.samstevens.totp.time.SystemTimeProvider();
            dev.samstevens.totp.code.CodeGenerator codeGenerator = new dev.samstevens.totp.code.DefaultCodeGenerator();
            dev.samstevens.totp.code.CodeVerifier verifier = new dev.samstevens.totp.code.DefaultCodeVerifier(codeGenerator, timeProvider);

            if (verifier.isValidCode(user.getMfaSecret(), code)) {
                String token = tokenProvider.generateToken(user);
                
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole());
                response.put("user", user);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(400).body("Invalid 2FA code");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying MFA: " + e.getMessage());
        }
    }
}