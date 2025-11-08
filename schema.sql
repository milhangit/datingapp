-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    gender TEXT,
    age INTEGER,
    dateOfBirth TEXT,
    religion TEXT,
    caste TEXT,
    height TEXT,
    bodyType TEXT,
    complexion TEXT,
    education TEXT,
    occupation TEXT,
    income TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    motherTongue TEXT,
    diet TEXT,
    smoking TEXT,
    drinking TEXT,
    familyType TEXT,
    familyValues TEXT,
    interests TEXT, -- JSON array
    bio TEXT,
    photo TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    targetUserId INTEGER NOT NULL,
    direction TEXT NOT NULL, -- 'left' or 'right'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (targetUserId) REFERENCES users(id),
    UNIQUE(userId, targetUserId)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1Id INTEGER NOT NULL,
    user2Id INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1Id) REFERENCES users(id),
    FOREIGN KEY (user2Id) REFERENCES users(id),
    UNIQUE(user1Id, user2Id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    recipientId INTEGER NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id),
    FOREIGN KEY (recipientId) REFERENCES users(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_swipes_userId ON swipes(userId);
CREATE INDEX IF NOT EXISTS idx_swipes_targetUserId ON swipes(targetUserId);
CREATE INDEX IF NOT EXISTS idx_matches_user1Id ON matches(user1Id);
CREATE INDEX IF NOT EXISTS idx_matches_user2Id ON matches(user2Id);
CREATE INDEX IF NOT EXISTS idx_messages_senderId ON messages(senderId);
CREATE INDEX IF NOT EXISTS idx_messages_recipientId ON messages(recipientId);

-- Insert sample users for testing
INSERT OR IGNORE INTO users (id, name, email, password, gender, age, religion, education, occupation, city, state, diet, interests, photo)
VALUES
(1, 'Sanjana Fernando', 'sanjana@example.com', 'password123', 'Female', 26, 'Buddhist', 'Bachelor''s', 'Teacher', 'Colombo', 'Western', 'Vegetarian', '["Reading","Yoga","Travel","Music"]', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'),
(2, 'Nimal Perera', 'nimal@example.com', 'password123', 'Male', 29, 'Buddhist', 'Master''s', 'Software Engineer', 'Kandy', 'Central', 'Non-Vegetarian', '["Sports","Gaming","Travel","Photography"]', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'),
(3, 'Kavitha Silva', 'kavitha@example.com', 'password123', 'Female', 25, 'Hindu', 'Bachelor''s', 'Doctor', 'Colombo', 'Western', 'Vegetarian', '["Dancing","Music","Cooking","Reading"]', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600'),
(4, 'Roshan De Silva', 'roshan@example.com', 'password123', 'Male', 31, 'Christian', 'Master''s', 'Engineer', 'Galle', 'Southern', 'Non-Vegetarian', '["Sports","Movies","Fitness","Travel"]', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600'),
(5, 'Amaya Jayawardena', 'amaya@example.com', 'password123', 'Female', 27, 'Buddhist', 'Bachelor''s', 'Accountant', 'Colombo', 'Western', 'Vegetarian', '["Photography","Art","Travel","Yoga"]', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'),
(6, 'Kasun Rajapaksa', 'kasun@example.com', 'password123', 'Male', 30, 'Buddhist', 'Master''s', 'Business', 'Colombo', 'Western', 'Non-Vegetarian', '["Fitness","Business","Travel","Movies"]', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600'),
(7, 'Dilini Wijesinghe', 'dilini@example.com', 'password123', 'Female', 24, 'Christian', 'Bachelor''s', 'Nurse', 'Negombo', 'Western', 'Non-Vegetarian', '["Music","Cooking","Dancing","Reading"]', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600'),
(8, 'Ashan Fernando', 'ashan@example.com', 'password123', 'Male', 28, 'Muslim', 'Master''s', 'Lawyer', 'Colombo', 'Western', 'Non-Vegetarian', '["Reading","Sports","Travel","Photography"]', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600');
