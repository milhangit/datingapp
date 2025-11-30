-- Seed Data for Dating App

-- Insert Dummy Users
INSERT INTO Users (msisdn, auth_state, premium_status) VALUES
('+15550000001', 'verified', 'free'),
('+15550000002', 'verified', 'gold'),
('+15550000003', 'verified', 'free'),
('+15550000004', 'verified', 'platinum'),
('+15550000005', 'verified', 'free');

-- Insert Dummy Profiles
INSERT INTO Profiles (user_id, full_name, age, bio, photos, gender, interested_in, location_lat, location_lon) VALUES
(
    (SELECT id FROM Users WHERE msisdn = '+15550000001'),
    'Sarah Miller',
    24,
    'Adventure seeker & coffee lover ☕️. Always planning my next trip!',
    '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop"]',
    'female',
    'male',
    40.7128, -74.0060
),
(
    (SELECT id FROM Users WHERE msisdn = '+15550000002'),
    'Jessica Chen',
    27,
    'Techie by day, artist by night 🎨. Looking for someone to explore galleries with.',
    '["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop"]',
    'female',
    'male',
    40.7128, -74.0060
),
(
    (SELECT id FROM Users WHERE msisdn = '+15550000003'),
    'Emily Wilson',
    22,
    'Student 📚. Love hiking and dogs 🐕.',
    '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop"]',
    'female',
    'male',
    40.7128, -74.0060
),
(
    (SELECT id FROM Users WHERE msisdn = '+15550000004'),
    'Michael Brown',
    29,
    'Chef 👨‍🍳. I make the best pasta in town.',
    '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop"]',
    'male',
    'female',
    40.7128, -74.0060
),
(
    (SELECT id FROM Users WHERE msisdn = '+15550000005'),
    'David Lee',
    26,
    'Musician 🎸. Let''s jam!',
    '["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop"]',
    'male',
    'female',
    40.7128, -74.0060
);
