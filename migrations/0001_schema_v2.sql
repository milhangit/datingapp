-- Migration number: 0001 	 2025-11-30T14:00:00.000Z

-- Users: Add new fields
ALTER TABLE Users ADD COLUMN last_active DATETIME;
ALTER TABLE Users ADD COLUMN premium_status TEXT DEFAULT 'free';

-- Profiles: Add new fields
ALTER TABLE Profiles ADD COLUMN photos TEXT DEFAULT '[]'; -- JSON array
ALTER TABLE Profiles ADD COLUMN location_lat REAL;
ALTER TABLE Profiles ADD COLUMN location_lon REAL;
ALTER TABLE Profiles ADD COLUMN preferences TEXT DEFAULT '{}'; -- JSON object
ALTER TABLE Profiles ADD COLUMN gender TEXT;
ALTER TABLE Profiles ADD COLUMN interested_in TEXT;

-- Matches: Add super like
ALTER TABLE Matches ADD COLUMN is_super_like BOOLEAN DEFAULT FALSE;

-- Chats: Add read receipt
ALTER TABLE Chats ADD COLUMN read_at DATETIME;

-- New Table: Swipes
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

-- New Table: VerificationCodes
CREATE TABLE VerificationCodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_swipes_swiper ON Swipes(swiper_id);
CREATE INDEX idx_profiles_location ON Profiles(location_lat, location_lon);
CREATE INDEX idx_users_msisdn ON Users(msisdn);
