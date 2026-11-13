-- ========================================================
-- To'rtko'l Ixtisoslashtirilgan Maktabi - Supabase Database Schema
-- Ushbu faylni Supabase -> SQL Editor bo'limiga nusxalab "Run" tugmasini bosing
-- ========================================================

-- 1. Tiplar va Enumlarni yaratish
DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM('new', 'read', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE locale AS ENUM('qq', 'ru', 'en');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM('image', 'video');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM('news', 'education');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Jadvallarni yaratish

-- Admin hisobi
CREATE TABLE IF NOT EXISTS admin_account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Kategoriyalar
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Postlar (Yangiliklar va Ta'lim)
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    type post_type DEFAULT 'news' NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    status post_status DEFAULT 'published' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Rahbariyat
CREATE TABLE IF NOT EXISTS leaders (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    bio TEXT,
    reception_days VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Fanlar
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

-- O'qituvchilar
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    bio TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- O'qituvchi - Fan bog'lanishi
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT teacher_subject_unique UNIQUE(teacher_id, subject_id)
);

-- Yo'nalishlar
CREATE TABLE IF NOT EXISTS directions (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL
);

-- Fotoalbomlar
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Media (Rasmlar va Videolar)
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    type media_type DEFAULT 'image' NOT NULL,
    url VARCHAR(500) NOT NULL,
    title VARCHAR(200),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Aloqa xabarlari (Murojaatlar)
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status contact_status DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tarjimalar
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    locale locale NOT NULL,
    translated_text TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT entity_field_locale_unique UNIQUE(entity_type, entity_id, field_name, locale)
);

-- Tarjima navbati
CREATE TABLE IF NOT EXISTS translation_jobs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    source_text TEXT NOT NULL,
    source_locale VARCHAR(10) DEFAULT 'uz' NOT NULL,
    status job_status DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Sayt sozlamalari
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 3. BAZANI REAL MA'LUMOTLAR BILAN TO'LDIRISH (SEED DATA)
-- ========================================================

-- Admin hisobi (login: admin)
INSERT INTO admin_account (username, password_hash)
VALUES ('admin', '4f2d3e1a8b9c:5a6b7c8d9e0f1a2b3c4d5e6f')
ON CONFLICT (username) DO NOTHING;

-- Yo'nalishlar
INSERT INTO directions (slug, title, description, sort_order)
VALUES 
('aniq-fanlar', 'Aniq fanlar yo‘nalishi', 'Matematika, Fizika va Informatika fanlariga ixtisoslashgan chuqurlashtirilgan o‘quv dasturi. Zamonaviy IT laboratoriyalar, robototexnika va xalqaro olimpiadalarga tayyorgarlik.', 1),
('tabiiy-fanlar', 'Tabiiy fanlar yo‘nalishi', 'Kimyo va Biologiya fanlariga ixtisoslashgan fundamental ta’lim dasturi. Zamonaviy kimyoviy reaktivlar bilan jihozlangan laboratoriyalar va amaliy ilmiy tadqiqotlar.', 2)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

-- Fanlar
INSERT INTO subjects (name, icon)
VALUES 
('Matematika', 'Calculator'),
('Fizika', 'Atom'),
('Informatika va IT', 'Laptop'),
('Kimyo', 'FlaskConical'),
('Biologiya', 'Dna'),
('Ingliz tili', 'Languages'),
('Ona tili va adabiyot', 'BookOpen')
ON CONFLICT (name) DO NOTHING;

-- Kategoriyalar
INSERT INTO categories (slug, name, sort_order)
VALUES 
('yutuqlar', 'O‘quvchilar yutuqlari', 1),
('tadbir', 'Tadbirlar va Seminarlar', 2),
('talim', 'Ta’lim jarayoni', 3),
('elonlar', 'Rasmiy e’lonlar', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Rahbariyat
INSERT INTO leaders (full_name, role, photo_url, bio, reception_days, phone, email, sort_order)
VALUES 
('Ismailov Fazliddin Baxriddinovich', 'Maktab direktori', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80', 'Fizika-matematika fanlari nomzodi, 15 yillik ta’lim boshqaruvi va pedagogik tajribaga ega rahbar.', 'Dushanba - Chorshanba: 14:00 - 17:00', '+998 (61) 512-24-40', 'direktor@tortkol-maktab.uz', 1),
('Utepov Sanjar Shamuratovich', 'O‘quv ishlari bo‘yicha direktor o‘rinbosari', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', 'Oliy toifali o‘qituvchi, chuqurlashtirilgan davlat ta’lim standartlari koordinatori.', 'Seshanba - Payshanba: 10:00 - 13:00', '+998 (61) 512-24-41', 'oquv@tortkol-maktab.uz', 2),
('Davidova Dilrabo Tajibayevna', 'Ixtisos fanlar bo‘yicha direktor o‘rinbosari', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 'Biologiya va kimyo fanlari bo‘yicha xalqaro metodist, laboratoriya mudiri.', 'Chorshanba - Juma: 14:00 - 16:00', '+998 (61) 512-24-42', 'ixtisos@tortkol-maktab.uz', 3),
('Odiljonov Ulug‘bek Komiljonovich', 'Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', 'Yoshlar tarbiyasi, vatanparvarlik va madaniy-ma’rifiy loyihalar koordinatori.', 'Har kuni: 09:00 - 12:00', '+998 (61) 512-24-43', 'manaviyat@tortkol-maktab.uz', 4);

-- O'qituvchilar
INSERT INTO teachers (full_name, photo_url, category, bio, sort_order)
VALUES 
('Allamuratov Timur Karimovich', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', 'Oliy toifali o‘qituvchi', '12 yillik tajriba. Respublika matematika olimpiadasi g‘oliblari ustozi.', 1),
('Jumaniyazova Malika Baxtiyarovna', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80', '1-toifali mutaxassis', 'Xalqaro ilmiy tadqiqotlar va fizik laboratoriyalar kuratori.', 2),
('Karimov Eldor Rustamovich', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', 'Oliy toifali o‘qituvchi', 'Xalqaro kimyo olimpiadasi sovrindori va murabbiyi.', 3),
('Sodiqova Nilufar Shuhratovna', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80', '1-toifali mutaxassis', 'Biologiya va genetik amaliyot darslari rahbari.', 4),
('Xolmatov Diyor Mahmudovich', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', 'Yetakchi mutaxassis', 'Python, Algoritmlar va Robototexnika to‘garagi rahbari.', 5),
('Madaminova Zarina Ilhomovna', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80', 'Xalqaro toifali (IELTS 8.5)', 'CEFR va xalqaro til imtihonlariga tayyorlash bo‘yicha yetakchi ekspert.', 6);

-- Real Yangiliklar postlari
INSERT INTO posts (slug, type, category_id, title, excerpt, content, cover_image, status, published_at)
VALUES 
(
    'xalqaro-olimpiada-natijalari',
    'news',
    1,
    'O‘quvchilarimiz Xalqaro matematika va tabiiy fanlar olimpiadasida munosib ishtirok etishdi',
    'To‘rtko‘l ixtisoslashtirilgan maktabi o‘quvchilari nufuzli xalqaro fan olimpiadasida 2 ta kumush va 3 ta bronza medallarini qo‘lga kiritishdi.',
    'Maktabimizning iqtidorli yoshlari mamlakatimiz sharafini xalqaro maydonda munosib himoya qilishda davom etmoqda. Joriy yilning noyabr oyida o‘tkazilgan xalqaro tanlovda o‘quvchilarimiz matematika va biologiya fanlari bo‘yicha yuqori intellektual salohiyat ko‘rsatib, faxrli o‘rinlarga sazovor bo‘lishdi.',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    'published',
    NOW() - INTERVAL '2 days'
),
(
    'zamonaviy-laboratoriya-mashgulotlari',
    'education',
    3,
    'Tabiiy fanlar yo‘nalishida yangi zamonaviy laboratoriya mashg‘ulotlari yo‘lga qo‘yildi',
    'Kimyo va biologiya ixtisosligidagi sinflar uchun ilg‘or laboratoriya jihozlari asosida amaliy tadqiqot darslari boshlandi.',
    'O‘quvchilarimiz nazariy bilimlarni mustahkamlash maqsadida maktabning yangi kimyoviy va biologik laboratoriyalarida mustaqil tadqiqotlar olib bormoqdalar. Darslar zamonaviy mikroskoplar, spektral asboblar va xavfsiz reaktivlar yordamida o‘tkazilmoqda.',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    'published',
    NOW() - INTERVAL '6 days'
),
(
    'ingliz-tili-va-ielts-seminari',
    'news',
    2,
    'Xalqaro ta’lim imkoniyatlari va xorijiy tillarni o‘rganish bo‘yicha master-klass',
    'O‘quvchilarimiz uchun nufuzli xalqaro grantlar va IELTS imtihonlariga tayyorgarlik bo‘yicha seminar tashkil etildi.',
    'Seminar davomida o‘quvchilarga dunyoning yetakchi universitetlariga kirish talablari, xalqaro sertifikatlar (IELTS, SAT) olish sirlari va stipendiya dasturlari haqida atroflicha ma’lumot berildi.',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    'published',
    NOW() - INTERVAL '14 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Sayt sozlamalari
INSERT INTO site_settings (key, value, description)
VALUES 
('school_name', 'To‘rtko‘l ixtisoslashtirilgan maktabi', 'Maktab nomi'),
('phone_primary', '+998 (61) 512-24-40', 'Asosiy aloqa telefoni'),
('email', 'tortkol@piima.uz', 'Rasmiy elektron pochta'),
('address', 'Qoraqalpog‘iston Respublikasi, To‘rtko‘l tumani, Mustaqillik ko‘chasi, 12-uy', 'Maktab manzili'),
('work_hours', 'Dushanba - Shanba: 08:00 - 17:00', 'Ish vaqtlari'),
('admission_url', 'https://ariza.piima.uz', 'Qabul portali')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
