package com.university.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendApplicationStatusUpdate(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void sendApplicationSubmitted(String to, String programName, String universityName) {
        String subject = "Application Submitted Successfully";
        String text = String.format(
            "Dear Applicant,\n\n" +
            "Your application for %s at %s has been submitted successfully.\n" +
            "We will review your application and get back to you soon.\n\n" +
            "Best regards,\n" +
            "University Application System",
            programName, universityName
        );
        sendApplicationStatusUpdate(to, subject, text);
    }

    public void sendApplicationStatusChanged(String to, String programName, String universityName, String status, String feedback) {
        String subject = "Application Status Update";
        String text = String.format(
            "Dear Applicant,\n\n" +
            "Your application status for %s at %s has been updated to: %s\n" +
            "Feedback: %s\n\n" +
            "Best regards,\n" +
            "University Application System",
            programName, universityName, status, feedback
        );
        sendApplicationStatusUpdate(to, subject, text);
    }
} 