-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, full_name, role) VALUES 
('ahmedali@whh.iq', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu', 'Ahmed Ali', 'super_admin');

-- Insert default rooms
INSERT INTO rooms (name_en, name_ar, type, price_per_night, description_en, description_ar, about_en, about_ar, features_en, features_ar, max_guests, size_sqm, view_type) VALUES 
('Royal Suite', 'الجناح الملكي', 'royal', 500.00, 
 'Luxurious royal suite with premium amenities', 
 'جناح ملكي فاخر مع وسائل راحة مميزة',
 'Experience the ultimate in luxury with our Royal Suite, featuring elegant furnishings and exceptional service.',
 'استمتع بأقصى درجات الفخامة مع جناحنا الملكي، الذي يتميز بأثاث أنيق وخدمة استثنائية.',
 ARRAY['Concierge Service', 'Private Dining', 'Spa Access', 'Airport Transfer'],
 ARRAY['خدمة الكونسيرج', 'تناول طعام خاص', 'دخول السبا', 'نقل المطار'],
 4, 80, 'city'),

('Executive Room', 'الغرفة التنفيذية', 'executive', 300.00,
 'Modern executive room perfect for business travelers',
 'غرفة تنفيذية حديثة مثالية لرجال الأعمال',
 'Designed for the modern business traveler with all essential amenities and workspace.',
 'مصممة للمسافر التجاري الحديث مع جميع وسائل الراحة الأساسية ومساحة العمل.',
 ARRAY['Business Center', 'Express Laundry', 'Room Service', 'Fitness Access'],
 ARRAY['مركز الأعمال', 'غسيل سريع', 'خدمة الغرف', 'دخول اللياقة'],
 2, 45, 'garden'),

('Classic Room', 'الغرفة الكلاسيكية', 'classic', 200.00,
 'Comfortable classic room with essential amenities',
 'غرفة كلاسيكية مريحة مع وسائل الراحة الأساسية',
 'A comfortable and well-appointed room offering all the essentials for a pleasant stay.',
 'غرفة مريحة ومجهزة تجهيزاً جيداً تقدم جميع الأساسيات لإقامة ممتعة.',
 ARRAY['Daily Housekeeping', 'WiFi Access', 'Mini Bar', 'Cable TV'],
 ARRAY['تنظيف يومي', 'واي فاي', 'ميني بار', 'تلفزيون كابل'],
 2, 35, 'pool');

-- Insert default apartments
INSERT INTO apartments (name_en, name_ar, type, price_per_night, description_en, description_ar, about_en, about_ar, features_en, features_ar, bedrooms, bathrooms, max_guests, size_sqm, view_type) VALUES 
('Deluxe Apartment', 'الشقة الفاخرة', 'deluxe', 400.00,
 'Spacious deluxe apartment for extended stays',
 'شقة فاخرة واسعة للإقامات الطويلة',
 'Perfect for extended stays with full kitchen facilities and separate living areas.',
 'مثالية للإقامات الطويلة مع مرافق مطبخ كاملة ومناطق معيشة منفصلة.',
 ARRAY['2 Bedrooms', 'Full Kitchen', 'Living Room', 'Balcony'],
 ARRAY['غرفتا نوم', 'مطبخ كامل', 'غرفة معيشة', 'شرفة'],
 2, 2, 4, 90, 'city'),

('Premium Apartment', 'الشقة المميزة', 'premium', 600.00,
 'Premium apartment with modern amenities',
 'شقة مميزة مع وسائل راحة حديثة',
 'Luxurious apartment featuring modern design and premium amenities for discerning guests.',
 'شقة فاخرة تتميز بتصميم حديث ووسائل راحة مميزة للضيوف المميزين.',
 ARRAY['3 Bedrooms', 'Modern Kitchen', 'Dining Area', 'City View'],
 ARRAY['3 غرف نوم', 'مطبخ حديث', 'منطقة طعام', 'إطلالة المدينة'],
 3, 2, 6, 120, 'city'),

('Penthouse Suite', 'جناح البنتهاوس', 'penthouse', 1000.00,
 'Exclusive penthouse with panoramic views',
 'بنتهاوس حصري مع إطلالات بانورامية',
 'The ultimate luxury experience with private terrace and breathtaking panoramic views.',
 'تجربة الفخامة المطلقة مع تراس خاص وإطلالات بانورامية خلابة.',
 ARRAY['4 Bedrooms', 'Private Terrace', 'Luxury Amenities', 'Panoramic View'],
 ARRAY['4 غرف نوم', 'تراس خاص', 'مرافق فاخرة', 'إطلالة بانورامية'],
 4, 3, 8, 200, 'panoramic');

-- Insert default halls
INSERT INTO halls (name_en, name_ar, type, capacity, price_per_hour, description_en, description_ar, about_en, about_ar, features_en, features_ar, size_sqm) VALUES 
('Al-Masla & Al-Login Hall', 'قاعة المسلة واللوجين', 'almasla', 200, 150.00,
 'Grand hall perfect for large events and celebrations',
 'قاعة كبيرة مثالية للفعاليات الكبيرة والاحتفالات',
 'Our largest venue, ideal for weddings, conferences, and major celebrations.',
 'أكبر قاعاتنا، مثالية لحفلات الزفاف والمؤتمرات والاحتفالات الكبرى.',
 ARRAY['Audio/Visual Equipment', 'Stage', 'Dance Floor', 'Catering Service'],
 ARRAY['معدات صوتية ومرئية', 'منصة', 'أرضية رقص', 'خدمة تقديم الطعام'],
 300),

('Al-Misk Hall', 'قاعة المسك', 'almisk', 150, 120.00,
 'Elegant hall for medium-sized events',
 'قاعة أنيقة للفعاليات متوسطة الحجم',
 'Beautifully designed hall perfect for corporate events and private parties.',
 'قاعة مصممة بشكل جميل مثالية للفعاليات المؤسسية والحفلات الخاصة.',
 ARRAY['Projector', 'Sound System', 'Lighting', 'Air Conditioning'],
 ARRAY['جهاز عرض', 'نظام صوتي', 'إضاءة', 'تكييف هواء'],
 200),

('Al-Malak Hall', 'قاعة الملاك', 'almalak', 100, 100.00,
 'Intimate hall for smaller gatherings',
 'قاعة حميمة للتجمعات الصغيرة',
 'Perfect for intimate celebrations and business meetings.',
 'مثالية للاحتفالات الحميمة واجتماعات العمل.',
 ARRAY['Meeting Setup', 'WiFi', 'Refreshment Area', 'Parking'],
 ARRAY['ترتيب اجتماعات', 'واي فاي', 'منطقة مرطبات', 'موقف سيارات'],
 150),

('Al-Zumurd Hall', 'قاعة الزمرد', 'alzumurd', 80, 80.00,
 'Cozy hall for exclusive events',
 'قاعة مريحة للفعاليات الحصرية',
 'An exclusive venue for VIP events and private dining experiences.',
 'مكان حصري لفعاليات كبار الشخصيات وتجارب تناول الطعام الخاصة.',
 ARRAY['VIP Service', 'Private Bar', 'Exclusive Access', 'Personal Butler'],
 ARRAY['خدمة كبار الشخصيات', 'بار خاص', 'دخول حصري', 'خادم شخصي'],
 120);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description_en, description_ar) VALUES 
('hero_video_url', 'https://streamable.com/e/xltjoh?autoplay=1&muted=1&nocontrols=1', 'url', 'Main hero video URL', 'رابط الفيديو الرئيسي'),
('hotel_phone', '+9640781234567811', 'text', 'Hotel main phone number', 'رقم هاتف الفندق الرئيسي'),
('hotel_email', 'info@whh.iq', 'text', 'Hotel main email', 'البريد الإلكتروني الرئيسي للفندق'),
('hotel_address_en', 'Al-Kindi Street, Qadisiyah, Baghdad, Iraq', 'text', 'Hotel address in English', 'عنوان الفندق بالإنجليزية'),
('hotel_address_ar', 'شارع الكندي، القادسية، بغداد، العراق', 'text', 'Hotel address in Arabic', 'عنوان الفندق بالعربية'),
('booking_enabled', 'true', 'boolean', 'Enable/disable booking system', 'تفعيل/إلغاء نظام الحجز'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'تفعيل وضع الصيانة');
