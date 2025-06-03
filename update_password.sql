-- Update the password to BCrypt encoded format
UPDATE users 
SET password = 'Bycrypt_encoded_password'  -
WHERE email = 'useremail'; 
