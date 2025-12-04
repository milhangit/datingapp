-- Seed Data

-- Users
INSERT INTO Users (msisdn, auth_state, role, is_verified) VALUES 
('+15550000001', 'verified', 'admin', 1),
('+15550000002', 'verified', 'user', 1),
('+15550000003', 'verified', 'user', 0),
('+15550000004', 'verified', 'user', 1),
('+15550000005', 'verified', 'user', 0);

-- Profiles
INSERT INTO Profiles (user_id, full_name, age, income, education, bio, gender, interested_in, location_lat, location_lon, photos) VALUES
(1, 'Admin User', 30, 100000, 'PhD', 'System Administrator', 'male', 'female', 40.7128, -74.0060, '["https://i.pravatar.cc/300?u=1"]'),
(2, 'Alice Smith', 25, 50000, 'Bachelors', 'Loves hiking and coffee.', 'female', 'male', 40.7128, -74.0060, '["https://i.pravatar.cc/300?u=2"]'),
(3, 'Bob Johnson', 28, 60000, 'Masters', 'Tech enthusiast.', 'male', 'female', 40.7328, -74.0160, '["https://i.pravatar.cc/300?u=3"]'),
(4, 'Charlie Brown', 32, 75000, 'Bachelors', 'Dog lover.', 'male', 'female', 40.7228, -74.0260, '["https://i.pravatar.cc/300?u=4"]'),
(5, 'Diana Prince', 29, 80000, 'Masters', 'Wondering about the world.', 'female', 'male', 40.7428, -74.0360, '["https://i.pravatar.cc/300?u=5"]');

-- Matches
INSERT INTO Matches (user_id_1, user_id_2, status) VALUES
(2, 3, 'matched'),
(2, 4, 'liked'),
(3, 5, 'matched');

-- Chats
INSERT INTO Chats (match_id, sender_id, message) VALUES
(1, 2, 'Hi Bob!'),
(1, 3, 'Hey Alice, how are you?'),
(3, 3, 'Hello Diana!');
