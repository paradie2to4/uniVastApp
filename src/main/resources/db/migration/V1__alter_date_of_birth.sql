-- First, create a temporary column
ALTER TABLE students ADD COLUMN date_of_birth_new DATE;

-- Convert existing data (assuming it's in a valid date format)
UPDATE students 
SET date_of_birth_new = date_of_birth::DATE 
WHERE date_of_birth IS NOT NULL;

-- Drop the old column
ALTER TABLE students DROP COLUMN date_of_birth;

-- Rename the new column to the original name
ALTER TABLE students RENAME COLUMN date_of_birth_new TO date_of_birth; 