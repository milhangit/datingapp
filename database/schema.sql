-- D1 Database Schema for Dating/Matrimonial Web App

-- Core Tables
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    msisdn TEXT NOT NULL UNIQUE,
    auth_state TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Profiles (
    user_id INTEGER PRIMARY KEY,
    full_name TEXT,
    age INTEGER,
    income REAL,
    education TEXT,
    bio TEXT,
    profile_picture_url TEXT,
    is_fake BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id_1 INTEGER NOT NULL,
    user_id_2 INTEGER NOT NULL,
    status TEXT, -- e.g., 'liked', 'matched', 'blocked'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES Users(id),
    FOREIGN KEY (user_id_2) REFERENCES Users(id)
);

CREATE TABLE Chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES Matches(id),
    FOREIGN KEY (sender_id) REFERENCES Users(id)
);

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
