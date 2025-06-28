-- Add application_count column to programs table
ALTER TABLE programs
ADD COLUMN application_count INT DEFAULT 0; 