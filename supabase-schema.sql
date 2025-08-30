-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(10) NOT NULL,
    pin VARCHAR(4) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_icon VARCHAR(10) NOT NULL,
    user_color VARCHAR(7) NOT NULL,
    mood VARCHAR(50) NOT NULL,
    intensity VARCHAR(10) CHECK (intensity IN ('low', 'medium', 'high')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample family members
INSERT INTO users (name, icon, pin, color, is_active) VALUES
    ('Alex', '👨‍💻', '1234', '#3B82F6', true),
    ('Teresa', '👩‍🎨', '5678', '#EC4899', true),
    ('River', '👧', '1111', '#10B981', true),
    ('Finn', '👦', '2222', '#F59E0B', true)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moods_user_id ON moods(user_id);
CREATE INDEX IF NOT EXISTS idx_moods_created_at ON moods(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (true);

-- Create policies for moods table
CREATE POLICY "Moods are viewable by everyone" ON moods
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own moods" ON moods
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own moods" ON moods
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own moods" ON moods
    FOR DELETE USING (true);

-- Create a function to automatically update created_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_users_created_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moods_created_at BEFORE UPDATE ON moods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
