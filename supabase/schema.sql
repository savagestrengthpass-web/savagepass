-- Create the members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_name TEXT NOT NULL,
    member_email TEXT,
    member_phone TEXT,
    member_id TEXT UNIQUE NOT NULL,
    date_joined DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    qr_code_secret TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- V1: Allow anon role full access (no auth in this version).
-- In production, replace with proper authentication and role-based policies.
CREATE POLICY "Allow full access for anon" ON members
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);
