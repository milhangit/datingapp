-- Migration: Add admin fields to Users table
ALTER TABLE Users ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE Users ADD COLUMN is_verified INTEGER DEFAULT 0;
