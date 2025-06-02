-- Update the password to BCrypt encoded format
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'  -- This is BCrypt encoded "My manu1234"
WHERE email = 'habaj@gmail.com'; 