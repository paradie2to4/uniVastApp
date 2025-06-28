package com.university.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ScheduledEmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(ScheduledEmailService.class);
    
    @Autowired
    private EmailService emailService;

    // Send daily summary email at 8:00 AM every day
    @Scheduled(cron = "0 * * * * ?")
    public void sendDailySummary() {
        try {
            String subject = "Daily Application Summary From Univast App";
            String text ="Hello Teacher this is UniVastApp";
            
            emailService.sendApplicationStatusUpdate("damascene10@gmail.com", subject, text);
            logger.info("Daily summary email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send daily summary email: " + e.getMessage());
        }
    }

    // Send weekly report every Monday at 9:00 AM
    @Scheduled(cron = "0 * * * * *")
    public void sendWeeklyReport() {
        try {
            String subject = "Weekly Application Report";
            String text = "Dear Admin,\n\n" +
                         "This is your weekly report of application activities.\n" +
                         "Please review the following metrics:\n" +
                         "- Total applications received this week\n" +
                         "- Applications pending review\n" +
                         "- Applications approved/rejected\n\n" +
                         "Best regards,\n" +
                         "University Application System";
            
            emailService.sendApplicationStatusUpdate("itsparadie24@gmail.com", subject, text);
            logger.info("Weekly report email sent successfully");
        } catch (Exception e) {
            logger.error("Failed to send weekly report email: " + e.getMessage());
        }
    }
} 