package com.ilovemusic.ilovemusic_backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@ilovemusic.com}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - ilovemusic");
            message.setText(buildPasswordResetEmailBody(username, resetLink));
            
            mailSender.send(message);
            log.info("✅ Password reset email SENT to: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send password reset email to {}: {} - {}", toEmail, e.getClass().getSimpleName(), e.getMessage());
            log.error("Email service might not be configured. Check GMAIL_EMAIL and GMAIL_PASSWORD in .env");
            // Don't throw exception - email service is non-critical
        }
    }

    private String buildPasswordResetEmailBody(String username, String resetLink) {
        return "Hello " + username + ",\n\n" +
                "We received a request to reset your password for your ilovemusic account.\n\n" +
                "Click the link below to reset your password (link expires in 30 minutes):\n" +
                resetLink + "\n\n" +
                "If you did not request a password reset, you can ignore this email.\n\n" +
                "Security tip: Never share your password reset link with anyone.\n\n" +
                "Best regards,\n" +
                "The ilovemusic Team";
    }
}

