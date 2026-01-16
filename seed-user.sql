-- Create a test user for login
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "User" (id, username, email, password, name, "createdAt", "updatedAt")
VALUES (
  'test-user-001',
  'admin',
  'admin@karoseri.com',
  '$2a$10$YourHashedPasswordHere',
  'Administrator',
  NOW(),
  NOW()
);
