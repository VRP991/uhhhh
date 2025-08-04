-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- royal, executive, classic
  price_per_night DECIMAL(10,2) DEFAULT 0,
  description_en TEXT,
  description_ar TEXT,
  about_en TEXT,
  about_ar TEXT,
  features_en TEXT[], -- Array of features in English
  features_ar TEXT[], -- Array of features in Arabic
  max_guests INTEGER DEFAULT 2,
  size_sqm INTEGER,
  view_type VARCHAR(100), -- city, garden, pool, etc.
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create apartments table
CREATE TABLE IF NOT EXISTS apartments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- deluxe, premium, penthouse
  price_per_night DECIMAL(10,2) DEFAULT 0,
  description_en TEXT,
  description_ar TEXT,
  about_en TEXT,
  about_ar TEXT,
  features_en TEXT[],
  features_ar TEXT[],
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 4,
  size_sqm INTEGER,
  view_type VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create halls table
CREATE TABLE IF NOT EXISTS halls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- almasla, almisk, almalak, alzumurd
  capacity INTEGER DEFAULT 50,
  price_per_hour DECIMAL(10,2) DEFAULT 0,
  description_en TEXT,
  description_ar TEXT,
  about_en TEXT,
  about_ar TEXT,
  features_en TEXT[],
  features_ar TEXT[],
  size_sqm INTEGER,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images table for all entities
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- room, apartment, hall, general
  entity_id UUID, -- Foreign key to rooms, apartments, or halls
  image_url TEXT NOT NULL,
  alt_text_en VARCHAR(255),
  alt_text_ar VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table for general settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text', -- text, number, boolean, json, url
  description_en TEXT,
  description_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- admin, super_admin
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);
CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_apartments_type ON apartments(type);
CREATE INDEX IF NOT EXISTS idx_apartments_active ON apartments(is_active);
CREATE INDEX IF NOT EXISTS idx_halls_type ON halls(type);
CREATE INDEX IF NOT EXISTS idx_halls_active ON halls(is_active);
CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_images_primary ON images(is_primary);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, adjust as needed)
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on apartments" ON apartments FOR ALL USING (true);
CREATE POLICY "Allow all operations on halls" ON halls FOR ALL USING (true);
CREATE POLICY "Allow all operations on images" ON images FOR ALL USING (true);
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on admin_users" ON admin_users FOR ALL USING (true);
