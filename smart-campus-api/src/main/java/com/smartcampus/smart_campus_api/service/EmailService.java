package com.smartcampus.smart_campus_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String firstName, String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Smart Campus - Account Created");
        
        String body = "Hello " + firstName + ",\n\n"
                + "Your account has been successfully created in the Smart Campus system.\n"
                + "Role: " + role + "\n\n"
                + "You can now log in to the portal using your Google account (Sign in with Google).\n\n"
                + "Best regards,\n"
                + "Smart Campus Administration";
        
        message.setText(body);
        
        try {
            mailSender.send(message);
            System.out.println("Welcome email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + toEmail + ". Error: " + e.getMessage());
        }
    }
    @Async
    public void sendNotificationEmail(String toEmail, String subject, String text) {
        if(toEmail == null || toEmail.trim().isEmpty()) return;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(text);
        
        try {
            mailSender.send(message);
            System.out.println("Notification email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send notification email to " + toEmail + ". Error: " + e.getMessage());
        }
    }
}
