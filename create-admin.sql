-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLogin DATETIME
);

-- Insert default admin
-- Username: admin
-- Password: YourNewPassword123!
-- (Change YourNewPassword123! to your desired password, then hash it)
-- Password hash below is for: admin123
INSERT OR IGNORE INTO admins (id, username, passwordHash, email, role)
VALUES (1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin@datingapp.com', 'superadmin');
