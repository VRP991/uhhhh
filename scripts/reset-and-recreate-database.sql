-- =====================================================
-- WORLD HEART HOTEL - COMPLETE DATABASE RESET & SETUP
-- =====================================================
-- This script will completely reset and recreate the database
-- WARNING: This will delete ALL existing data!

-- Drop all existing tables (in correct order to avoid foreign key conflicts)
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS halls CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow all operations on rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all operations on apartments" ON apartments;
DROP POLICY IF EXISTS "Allow all operations on halls" ON halls;
DROP POLICY IF EXISTS "Allow all operations on images" ON images;
DROP POLICY IF EXISTS "Allow all operations on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow all operations on admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow all operations on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow all operations on contacts" ON contacts;

-- =====================================================
-- CREATE CORE TABLES
-- =====================================================

-- Create admin_users table (for site manager authentication)
CREATE TABLE admin_users (
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

-- Create rooms table
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- royal, executive, classic, etc.
  price_per_night DECIMAL(10,2) DEFAULT 0,
  description_en TEXT,
  description_ar TEXT,
  about_en TEXT,
  about_ar TEXT,
  features_en TEXT[], -- Array of features in English
  features_ar TEXT[], -- Array of features in Arabic
  max_guests INTEGER DEFAULT 2,
  size_sqm INTEGER,
  view_type VARCHAR(100), -- city, garden, pool, panoramic, etc.
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create apartments table
CREATE TABLE apartments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- deluxe, premium, penthouse, etc.
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
CREATE TABLE halls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- almasla, almisk, almalak, alzumurd, etc.
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

-- Create images table (for all entities)
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- room, apartment, hall, general
  entity_id UUID, -- Foreign key to rooms, apartments, or halls (NULL for general images)
  image_url TEXT NOT NULL,
  alt_text_en VARCHAR(255),
  alt_text_ar VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add foreign key constraints
  CONSTRAINT fk_images_rooms FOREIGN KEY (entity_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_images_apartments FOREIGN KEY (entity_id) REFERENCES apartments(id) ON DELETE CASCADE,
  CONSTRAINT fk_images_halls FOREIGN KEY (entity_id) REFERENCES halls(id) ON DELETE CASCADE
);

-- Create site_settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text', -- text, number, boolean, json, url
  description_en TEXT,
  description_ar TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether this setting can be accessed publicly
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table (existing functionality)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  check_in TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out TIMESTAMP WITH TIME ZONE NOT NULL,
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table (existing functionality)
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Admin users indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Rooms indexes
CREATE INDEX idx_rooms_type ON rooms(type);
CREATE INDEX idx_rooms_active ON rooms(is_active);
CREATE INDEX idx_rooms_sort ON rooms(sort_order);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);

-- Apartments indexes
CREATE INDEX idx_apartments_type ON apartments(type);
CREATE INDEX idx_apartments_active ON apartments(is_active);
CREATE INDEX idx_apartments_sort ON apartments(sort_order);
CREATE INDEX idx_apartments_price ON apartments(price_per_night);

-- Halls indexes
CREATE INDEX idx_halls_type ON halls(type);
CREATE INDEX idx_halls_active ON halls(is_active);
CREATE INDEX idx_halls_sort ON halls(sort_order);
CREATE INDEX idx_halls_capacity ON halls(capacity);

-- Images indexes
CREATE INDEX idx_images_entity ON images(entity_type, entity_id);
CREATE INDEX idx_images_primary ON images(is_primary);
CREATE INDEX idx_images_sort ON images(sort_order);

-- Site settings indexes
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_public ON site_settings(is_public);

-- Bookings indexes
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);

-- Contacts indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE SECURITY POLICIES
-- =====================================================

-- Admin users policies
CREATE POLICY "Allow all operations on admin_users" ON admin_users FOR ALL USING (true);

-- Rooms policies
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);

-- Apartments policies
CREATE POLICY "Allow all operations on apartments" ON apartments FOR ALL USING (true);

-- Halls policies
CREATE POLICY "Allow all operations on halls" ON halls FOR ALL USING (true);

-- Images policies
CREATE POLICY "Allow all operations on images" ON images FOR ALL USING (true);

-- Site settings policies
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true);

-- Bookings policies
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);

-- Contacts policies
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default admin user
INSERT INTO admin_users (email, password_hash, full_name, role, is_active) VALUES 
('ahmedali@whh.iq', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu', 'Ahmed Ali', 'super_admin', true);

-- Insert default rooms with comprehensive data
INSERT INTO rooms (
  name_en, name_ar, type, price_per_night, 
  description_en, description_ar, 
  about_en, about_ar, 
  features_en, features_ar, 
  max_guests, size_sqm, view_type, sort_order
) VALUES 
-- Royal Suite
(
  'Royal Suite', 'الجناح الملكي', 'royal', 500.00,
  'Luxurious royal suite with premium amenities and exceptional service',
  'جناح ملكي فاخر مع وسائل راحة مميزة وخدمة استثنائية',
  'Experience the ultimate in luxury with our Royal Suite, featuring elegant furnishings, spacious living areas, and personalized service that caters to your every need. This magnificent suite offers breathtaking views and world-class amenities.',
  'استمتع بأقصى درجات الفخامة مع جناحنا الملكي، الذي يتميز بأثاث أنيق ومناطق معيشة واسعة وخدمة شخصية تلبي جميع احتياجاتك. يوفر هذا الجناح الرائع إطلالات خلابة ووسائل راحة عالمية المستوى.',
  ARRAY['24/7 Concierge Service', 'Private Dining Room', 'Exclusive Spa Access', 'Airport Limousine Transfer', 'Personal Butler', 'Premium Minibar', 'Marble Bathroom', 'King Size Bed'],
  ARRAY['خدمة الكونسيرج على مدار الساعة', 'غرفة طعام خاصة', 'دخول حصري للسبا', 'نقل ليموزين من المطار', 'خادم شخصي', 'ميني بار مميز', 'حمام رخامي', 'سرير ملكي'],
  4, 80, 'city', 1
),

-- Executive Room
(
  'Executive Room', 'الغرفة التنفيذية', 'executive', 300.00,
  'Modern executive room designed for business travelers with premium amenities',
  'غرفة تنفيذية حديثة مصممة لرجال الأعمال مع وسائل راحة مميزة',
  'Designed specifically for the modern business traveler, our Executive Room combines comfort with functionality. Features include a dedicated workspace, high-speed internet, and access to exclusive business facilities.',
  'مصممة خصيصاً للمسافر التجاري الحديث، تجمع غرفتنا التنفيذية بين الراحة والوظائف العملية. تشمل الميزات مساحة عمل مخصصة وإنترنت عالي السرعة ودخول لمرافق الأعمال الحصرية.',
  ARRAY['Business Center Access', 'Express Laundry Service', '24/7 Room Service', 'Fitness Center Access', 'High-Speed WiFi', 'Work Desk', 'Coffee Machine', 'City View'],
  ARRAY['دخول مركز الأعمال', 'خدمة غسيل سريعة', 'خدمة الغرف على مدار الساعة', 'دخول مركز اللياقة', 'واي فاي عالي السرعة', 'مكتب عمل', 'آلة قهوة', 'إطلالة المدينة'],
  2, 45, 'garden', 2
),

-- Classic Room
(
  'Classic Room', 'الغرفة الكلاسيكية', 'classic', 200.00,
  'Comfortable classic room with essential amenities for a pleasant stay',
  'غرفة كلاسيكية مريحة مع وسائل الراحة الأساسية لإقامة ممتعة',
  'Our Classic Room offers comfort and value without compromising on quality. Perfect for leisure travelers, featuring all essential amenities and thoughtful touches that make your stay memorable.',
  'تقدم غرفتنا الكلاسيكية الراحة والقيمة دون التنازل عن الجودة. مثالية للمسافرين للترفيه، تتميز بجميع وسائل الراحة الأساسية واللمسات المدروسة التي تجعل إقامتك لا تُنسى.',
  ARRAY['Daily Housekeeping', 'Complimentary WiFi', 'Mini Bar', 'Cable TV', 'Air Conditioning', 'Safe Box', 'Hair Dryer', 'Pool View'],
  ARRAY['تنظيف يومي', 'واي فاي مجاني', 'ميني بار', 'تلفزيون كابل', 'تكييف هواء', 'خزنة آمنة', 'مجفف شعر', 'إطلالة المسبح'],
  2, 35, 'pool', 3
);

-- Insert default apartments
INSERT INTO apartments (
  name_en, name_ar, type, price_per_night,
  description_en, description_ar,
  about_en, about_ar,
  features_en, features_ar,
  bedrooms, bathrooms, max_guests, size_sqm, view_type, sort_order
) VALUES 
-- Deluxe Apartment
(
  'Deluxe Apartment', 'الشقة الفاخرة', 'deluxe', 400.00,
  'Spacious deluxe apartment perfect for extended stays and families',
  'شقة فاخرة واسعة مثالية للإقامات الطويلة والعائلات',
  'Our Deluxe Apartment provides the perfect home away from home experience. With separate living and sleeping areas, full kitchen facilities, and premium amenities, it is ideal for extended stays and family vacations.',
  'توفر شقتنا الفاخرة تجربة البيت الثاني المثالية. مع مناطق معيشة ونوم منفصلة ومرافق مطبخ كاملة ووسائل راحة مميزة، فهي مثالية للإقامات الطويلة وعطلات العائلة.',
  ARRAY['2 Separate Bedrooms', 'Full Kitchen with Appliances', 'Spacious Living Room', 'Private Balcony', 'Washing Machine', 'Dining Area', 'Multiple Bathrooms', 'Family Entertainment'],
  ARRAY['غرفتا نوم منفصلتان', 'مطبخ كامل مع الأجهزة', 'غرفة معيشة واسعة', 'شرفة خاصة', 'غسالة ملابس', 'منطقة طعام', 'حمامات متعددة', 'ترفيه عائلي'],
  2, 2, 4, 90, 'city', 1
),

-- Premium Apartment
(
  'Premium Apartment', 'الشقة المميزة', 'premium', 600.00,
  'Premium apartment with modern design and luxury amenities',
  'شقة مميزة بتصميم حديث ووسائل راحة فاخرة',
  'Experience luxury living in our Premium Apartment, featuring contemporary design, high-end furnishings, and panoramic city views. Perfect for discerning guests who appreciate fine details and exceptional comfort.',
  'استمتع بالعيش الفاخر في شقتنا المميزة، التي تتميز بتصميم معاصر وأثاث راقي وإطلالات بانورامية على المدينة. مثالية للضيوف المميزين الذين يقدرون التفاصيل الدقيقة والراحة الاستثنائية.',
  ARRAY['3 Luxury Bedrooms', 'Modern Gourmet Kitchen', 'Elegant Dining Area', 'Panoramic City Views', 'Premium Appliances', 'Master Suite', 'Guest Bathroom', 'Smart Home Features'],
  ARRAY['3 غرف نوم فاخرة', 'مطبخ حديث للذواقة', 'منطقة طعام أنيقة', 'إطلالات بانورامية على المدينة', 'أجهزة مميزة', 'جناح رئيسي', 'حمام ضيوف', 'ميزات المنزل الذكي'],
  3, 2, 6, 120, 'city', 2
),

-- Penthouse Suite
(
  'Penthouse Suite', 'جناح البنتهاوس', 'penthouse', 1000.00,
  'Exclusive penthouse with private terrace and breathtaking panoramic views',
  'بنتهاوس حصري مع تراس خاص وإطلالات بانورامية خلابة',
  'The ultimate luxury experience awaits in our Penthouse Suite. This exclusive residence features a private terrace, premium amenities, and unparalleled views of Baghdad. Perfect for special occasions and VIP guests.',
  'تنتظرك تجربة الفخامة المطلقة في جناح البنتهاوس الخاص بنا. يتميز هذا المسكن الحصري بتراس خاص ووسائل راحة مميزة وإطلالات لا مثيل لها على بغداد. مثالي للمناسبات الخاصة وضيوف كبار الشخصيات.',
  ARRAY['4 Master Bedrooms', 'Private Rooftop Terrace', 'Luxury Amenities Package', '360° Panoramic Views', 'Private Elevator Access', 'Jacuzzi', 'Home Theater', 'Personal Chef Service'],
  ARRAY['4 غرف نوم رئيسية', 'تراس خاص على السطح', 'حزمة وسائل راحة فاخرة', 'إطلالات بانورامية 360°', 'دخول مصعد خاص', 'جاكوزي', 'مسرح منزلي', 'خدمة طاهٍ شخصي'],
  4, 3, 8, 200, 'panoramic', 3
);

-- Insert default halls
INSERT INTO halls (
  name_en, name_ar, type, capacity, price_per_hour,
  description_en, description_ar,
  about_en, about_ar,
  features_en, features_ar,
  size_sqm, sort_order
) VALUES 
-- Al-Masla & Al-Login Hall
(
  'Al-Masla & Al-Login Hall', 'قاعة المسلة واللوجين', 'almasla', 200, 150.00,
  'Grand ballroom perfect for large weddings, conferences, and major celebrations',
  'قاعة احتفالات كبيرة مثالية لحفلات الزفاف الكبيرة والمؤتمرات والاحتفالات الكبرى',
  'Our largest and most prestigious venue, Al-Masla & Al-Login Hall can accommodate up to 200 guests. With its elegant décor, state-of-the-art facilities, and professional event coordination, it is perfect for grand celebrations and corporate events.',
  'أكبر وأرقى قاعاتنا، يمكن لقاعة المسلة واللوجين استيعاب ما يصل إلى 200 ضيف. مع ديكورها الأنيق ومرافقها الحديثة وتنسيق الفعاليات المهني، فهي مثالية للاحتفالات الكبرى والفعاليات المؤسسية.',
  ARRAY['Professional Audio/Visual Equipment', 'Elevated Stage Platform', 'LED Dance Floor', 'Full Catering Kitchen', 'Bridal Suite', 'VIP Lounge', 'Parking for 100 Cars', 'Event Coordination'],
  ARRAY['معدات صوتية ومرئية احترافية', 'منصة مرتفعة', 'أرضية رقص LED', 'مطبخ تقديم طعام كامل', 'جناح العروس', 'صالة كبار الشخصيات', 'موقف لـ100 سيارة', 'تنسيق الفعاليات'],
  300, 1
),

-- Al-Misk Hall
(
  'Al-Misk Hall', 'قاعة المسك', 'almisk', 150, 120.00,
  'Elegant mid-sized hall ideal for corporate events and private celebrations',
  'قاعة أنيقة متوسطة الحجم مثالية للفعاليات المؤسسية والاحتفالات الخاصة',
  'Al-Misk Hall offers the perfect balance of intimacy and grandeur. With capacity for 150 guests, modern amenities, and flexible seating arrangements, it is ideal for corporate meetings, private parties, and medium-sized celebrations.',
  'تقدم قاعة المسك التوازن المثالي بين الحميمية والفخامة. مع سعة لـ150 ضيف ووسائل راحة حديثة وترتيبات جلوس مرنة، فهي مثالية للاجتماعات المؤسسية والحفلات الخاصة والاحتفالات متوسطة الحجم.',
  ARRAY['HD Projector System', 'Surround Sound System', 'Adjustable Lighting', 'Climate Control', 'Wireless Microphones', 'Catering Prep Area', 'Reception Space', 'Technical Support'],
  ARRAY['نظام عرض عالي الدقة', 'نظام صوت محيطي', 'إضاءة قابلة للتعديل', 'تحكم في المناخ', 'ميكروفونات لاسلكية', 'منطقة تحضير الطعام', 'مساحة استقبال', 'دعم تقني'],
  200, 2
),

-- Al-Malak Hall
(
  'Al-Malak Hall', 'قاعة الملاك', 'almalak', 100, 100.00,
  'Intimate hall perfect for smaller gatherings and business meetings',
  'قاعة حميمة مثالية للتجمعات الصغيرة واجتماعات العمل',
  'Al-Malak Hall provides an intimate setting for smaller events. With its warm ambiance and modern facilities, it is perfect for business meetings, family celebrations, and private dining experiences.',
  'توفر قاعة الملاك بيئة حميمة للفعاليات الصغيرة. مع أجوائها الدافئة ومرافقها الحديثة، فهي مثالية لاجتماعات العمل والاحتفالات العائلية وتجارب تناول الطعام الخاصة.',
  ARRAY['Boardroom Setup Available', 'High-Speed WiFi', 'Coffee & Tea Station', 'Dedicated Parking', 'Natural Lighting', 'Presentation Screen', 'Conference Phone', 'Catering Options'],
  ARRAY['ترتيب غرفة اجتماعات متاح', 'واي فاي عالي السرعة', 'محطة قهوة وشاي', 'موقف مخصص', 'إضاءة طبيعية', 'شاشة عرض', 'هاتف مؤتمرات', 'خيارات تقديم الطعام'],
  150, 3
),

-- Al-Zumurd Hall
(
  'Al-Zumurd Hall', 'قاعة الزمرد', 'alzumurd', 80, 80.00,
  'Exclusive boutique hall for VIP events and private dining experiences',
  'قاعة بوتيك حصرية لفعاليات كبار الشخصيات وتجارب تناول الطعام الخاصة',
  'Al-Zumurd Hall is our most exclusive venue, designed for VIP events and intimate gatherings. With personalized service and luxury amenities, it offers an unparalleled experience for discerning clients.',
  'قاعة الزمرد هي أكثر قاعاتنا حصرية، مصممة لفعاليات كبار الشخصيات والتجمعات الحميمة. مع الخدمة الشخصية ووسائل الراحة الفاخرة، تقدم تجربة لا مثيل لها للعملاء المميزين.',
  ARRAY['Dedicated VIP Service', 'Private Bar Service', 'Exclusive Access Control', 'Personal Event Butler', 'Premium Sound System', 'Mood Lighting', 'Private Entrance', 'Luxury Furnishings'],
  ARRAY['خدمة كبار شخصيات مخصصة', 'خدمة بار خاص', 'تحكم دخول حصري', 'خادم فعاليات شخصي', 'نظام صوت مميز', 'إضاءة مزاجية', 'مدخل خاص', 'أثاث فاخر'],
  120, 4
);

-- Insert comprehensive site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description_en, description_ar, is_public) VALUES 
-- Hero Video Settings
('hero_video_url', 'https://streamable.com/e/xltjoh?autoplay=1&muted=1&nocontrols=1', 'url', 'Main hero video URL for homepage', 'رابط الفيديو الرئيسي للصفحة الرئيسية', true),
('hero_video_fallback', '/placeholder-video.mp4', 'url', 'Fallback video file for hero section', 'ملف فيديو احتياطي للقسم الرئيسي', true),

-- Contact Information
('hotel_phone_main', '+9640781234567811', 'text', 'Hotel main phone number', 'رقم هاتف الفندق الرئيسي', true),
('hotel_phone_secondary', '7377', 'text', 'Hotel secondary phone number', 'رقم هاتف الفندق الثانوي', true),
('hotel_email_main', 'info@whh.iq', 'text', 'Hotel main email address', 'البريد الإلكتروني الرئيسي للفندق', true),
('hotel_email_reservations', 'reservations@whh.iq', 'text', 'Hotel reservations email', 'بريد حجوزات الفندق الإلكتروني', true),

-- Address Information
('hotel_address_en', 'Al-Kindi Street, Qadisiyah, Baghdad, Iraq', 'text', 'Hotel address in English', 'عنوان الفندق بالإنجليزية', true),
('hotel_address_ar', 'شارع الكندي، القادسية، بغداد، العراق', 'text', 'Hotel address in Arabic', 'عنوان الفندق بالعربية', true),
('hotel_coordinates', '33.3152,44.3661', 'text', 'Hotel GPS coordinates (lat,lng)', 'إحداثيات GPS للفندق', true),

-- Hotel Information
('hotel_name_en', 'World Heart Hotel', 'text', 'Hotel name in English', 'اسم الفندق بالإنجليزية', true),
('hotel_name_ar', 'فندق قلب العالم', 'text', 'Hotel name in Arabic', 'اسم الفندق بالعربية', true),
('hotel_tagline_en', 'Where the Elite Belong', 'text', 'Hotel tagline in English', 'شعار الفندق بالإنجليزية', true),
('hotel_tagline_ar', 'حيث تنتمي النخبة', 'text', 'Hotel tagline in Arabic', 'شعار الفندق بالعربية', true),

-- System Settings
('booking_enabled', 'true', 'boolean', 'Enable/disable booking system', 'تفعيل/إلغاء نظام الحجز', false),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'تفعيل وضع الصيانة', false),
('site_language_default', 'en', 'text', 'Default site language', 'لغة الموقع الافتراضية', true),
('currency_code', 'USD', 'text', 'Currency code for pricing', 'رمز العملة للأسعار', true),
('currency_symbol', '$', 'text', 'Currency symbol', 'رمز العملة', true),

-- Social Media & Marketing
('facebook_url', 'https://facebook.com/worldhearthotel', 'url', 'Facebook page URL', 'رابط صفحة فيسبوك', true),
('instagram_url', 'https://instagram.com/worldhearthotel', 'url', 'Instagram page URL', 'رابط صفحة إنستغرام', true),
('twitter_url', 'https://twitter.com/worldhearthotel', 'url', 'Twitter page URL', 'رابط صفحة تويتر', true),

-- Email Settings
('smtp_host', 'mail.whh.iq', 'text', 'SMTP server host', 'خادم SMTP', false),
('smtp_port', '465', 'number', 'SMTP server port', 'منفذ خادم SMTP', false),
('smtp_user', 'otp@whh.iq', 'text', 'SMTP username', 'اسم مستخدم SMTP', false),
('smtp_from_name', 'World Heart Hotel', 'text', 'Email sender name', 'اسم مرسل البريد الإلكتروني', false),

-- Business Hours
('business_hours_checkin', '14:00', 'text', 'Check-in time', 'وقت تسجيل الوصول', true),
('business_hours_checkout', '12:00', 'text', 'Check-out time', 'وقت تسجيل المغادرة', true),
('business_hours_reception', '24/7', 'text', 'Reception hours', 'ساعات الاستقبال', true),

-- Policies & Terms
('cancellation_policy_en', 'Free cancellation up to 24 hours before check-in', 'text', 'Cancellation policy in English', 'سياسة الإلغاء بالإنجليزية', true),
('cancellation_policy_ar', 'إلغاء مجاني حتى 24 ساعة قبل تسجيل الوصول', 'text', 'Cancellation policy in Arabic', 'سياسة الإلغاء بالعربية', true),

-- SEO Settings
('meta_title_en', 'World Heart Hotel - Luxury Hotel in Baghdad', 'text', 'Meta title in English', 'عنوان الميتا بالإنجليزية', true),
('meta_title_ar', 'فندق قلب العالم - فندق فاخر في بغداد', 'text', 'Meta title in Arabic', 'عنوان الميتا بالعربية', true),
('meta_description_en', 'Experience luxury at World Heart Hotel in Baghdad. Premium rooms, exceptional service, and world-class amenities in the heart of Qadisiyah district.', 'text', 'Meta description in English', 'وصف الميتا بالإنجليزية', true),
('meta_description_ar', 'استمتع بالفخامة في فندق قلب العالم في بغداد. غرف مميزة وخدمة استثنائية ووسائل راحة عالمية في قلب منطقة القادسية.', 'text', 'Meta description in Arabic', 'وصف الميتا بالعربية', true);

-- =====================================================
-- CREATE USEFUL FUNCTIONS
-- =====================================================

-- Function to get active rooms with images
CREATE OR REPLACE FUNCTION get_active_rooms_with_images()
RETURNS TABLE (
  id UUID,
  name_en VARCHAR,
  name_ar VARCHAR,
  type VARCHAR,
  price_per_night DECIMAL,
  description_en TEXT,
  description_ar TEXT,
  about_en TEXT,
  about_ar TEXT,
  features_en TEXT[],
  features_ar TEXT[],
  max_guests INTEGER,
  size_sqm INTEGER,
  view_type VARCHAR,
  primary_image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name_en,
    r.name_ar,
    r.type,
    r.price_per_night,
    r.description_en,
    r.description_ar,
    r.about_en,
    r.about_ar,
    r.features_en,
    r.features_ar,
    r.max_guests,
    r.size_sqm,
    r.view_type,
    i.image_url as primary_image_url
  FROM rooms r
  LEFT JOIN images i ON r.id = i.entity_id AND i.entity_type = 'room' AND i.is_primary = true
  WHERE r.is_active = true
  ORDER BY r.sort_order;
END;
$$ LANGUAGE plpgsql;

-- Function to get public site settings
CREATE OR REPLACE FUNCTION get_public_settings()
RETURNS TABLE (
  setting_key VARCHAR,
  setting_value TEXT,
  setting_type VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.setting_key,
    s.setting_value,
    s.setting_type
  FROM site_settings s
  WHERE s.is_public = true;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

-- Verify all tables were created successfully
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('admin_users', 'rooms', 'apartments', 'halls', 'images', 'site_settings', 'bookings', 'contacts');
  
  IF table_count = 8 THEN
    RAISE NOTICE 'SUCCESS: All 8 tables created successfully!';
    RAISE NOTICE 'Tables: admin_users, rooms, apartments, halls, images, site_settings, bookings, contacts';
  ELSE
    RAISE NOTICE 'WARNING: Expected 8 tables, found %', table_count;
  END IF;
END $$;

-- Show summary of inserted data
SELECT 
  'Admin Users' as table_name, COUNT(*) as record_count FROM admin_users
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Apartments', COUNT(*) FROM apartments  
UNION ALL
SELECT 'Halls', COUNT(*) FROM halls
UNION ALL
SELECT 'Site Settings', COUNT(*) FROM site_settings
ORDER BY table_name;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'WORLD HEART HOTEL DATABASE SETUP COMPLETED!';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Admin Login Credentials:';
  RAISE NOTICE 'Email: ahmedali@whh.iq';
  RAISE NOTICE 'Password: @@aahhmm@@';
  RAISE NOTICE '';
  RAISE NOTICE 'Access Site Manager at: /admin/1/dash';
  RAISE NOTICE '=================================================';
END $$;
