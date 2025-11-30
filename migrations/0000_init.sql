-- D1 Database Schema for Dating/Matrimonial Web App (v2)

-- Core Tables
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    msisdn TEXT NOT NULL UNIQUE,
    auth_state TEXT,
    last_active DATETIME,
    premium_status TEXT DEFAULT 'free', -- free, gold, platinum
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Profiles (
    user_id INTEGER PRIMARY KEY,
    full_name TEXT,
    age INTEGER,
    income REAL,
    education TEXT,
    bio TEXT,
    profile_picture_url TEXT, -- Legacy, use photos array
    photos TEXT DEFAULT '[]', -- JSON array of photo URLs
    location_lat REAL,
    location_lon REAL,
    preferences TEXT DEFAULT '{}', -- JSON object
    gender TEXT,
    interested_in TEXT,
    is_fake BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id_1 INTEGER NOT NULL,
    user_id_2 INTEGER NOT NULL,
    status TEXT, -- 'liked', 'matched', 'blocked'
    is_super_like BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES Users(id),
    FOREIGN KEY (user_id_2) REFERENCES Users(id)
);

CREATE TABLE Chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message TEXT,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES Matches(id),
    FOREIGN KEY (sender_id) REFERENCES Users(id)
);

CREATE TABLE Swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swiper_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    direction TEXT NOT NULL, -- 'left', 'right'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (swiper_id) REFERENCES Users(id),
    FOREIGN KEY (target_id) REFERENCES Users(id),
    UNIQUE(swiper_id, target_id)
);

CREATE TABLE VerificationCodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Groups (Legacy/Optional)
CREATE TABLE Groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GroupMembers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE GroupMessages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES Groups(id),
    FOREIGN KEY (sender_id) REFERENCES Users(id)
);

-- AI Configuration
CREATE TABLE AIPromptTemplates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL, -- 'en' or 'si'
    template_name TEXT NOT NULL,
    template_text TEXT NOT NULL
);

CREATE TABLE AIConversationLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    fake_user_id INTEGER NOT NULL,
    message TEXT,
    response TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (fake_user_id) REFERENCES Users(id)
);

-- Indexes
CREATE INDEX idx_swipes_swiper ON Swipes(swiper_id);
CREATE INDEX idx_profiles_location ON Profiles(location_lat, location_lon);
CREATE INDEX idx_users_msisdn ON Users(msisdn);
