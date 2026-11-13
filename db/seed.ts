import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import crypto from 'crypto';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required to run seed.');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  console.log('🌱 Seeding database with real school data...');

  // 1. Admin Akkaunti (default login: admin, parol: Turtkol2026!)
  const passwordHash = await hashPassword('Turtkol2026!');
  await db.insert(schema.adminAccount).values({
    username: 'admin',
    passwordHash,
  }).onConflictDoNothing();

  // 2. Kategoriyalar
  await db.insert(schema.categories).values([
    { slug: 'yutuqlar', name: "O'quvchilar yutuqlari", sortOrder: 1 },
    { slug: 'tadbir', name: 'Ilmiy va madaniy tadbirlar', sortOrder: 2 },
    { slug: 'elonlar', name: "Muhim e'lonlar", sortOrder: 3 },
    { slug: 'talim', name: "Ta'lim yangiliklari", sortOrder: 4 },
  ]).onConflictDoNothing();

  // 3. Fanlar
  await db.insert(schema.subjects).values([
    { name: 'Matematika', icon: 'Calculator' },
    { name: 'Fizika', icon: 'Atom' },
    { name: 'Informatika va IT', icon: 'Laptop' },
    { name: 'Kimyo', icon: 'FlaskConical' },
    { name: 'Biologiya', icon: 'Dna' },
    { name: 'Ingliz tili', icon: 'Languages' },
    { name: 'Ona tili va adabiyot', icon: 'BookOpen' },
  ]).onConflictDoNothing();

  // 4. Yo'nalishlar
  await db.insert(schema.directions).values([
    {
      slug: 'aniq-fanlar',
      title: 'Aniq fanlar yo‘nalishi',
      description: 'Matematika, Fizika va Informatika fanlariga ixtisoslashgan chuqurlashtirilgan o‘quv dasturi. IT va muhandislikka tayyorlaydi.',
      sortOrder: 1,
    },
    {
      slug: 'tabiiy-fanlar',
      title: 'Tabiiy fanlar yo‘nalishi',
      description: 'Kimyo va Biologiya fanlariga ixtisoslashgan, tibbiyot, farmatsevtika va biotexnologiya sohalari uchun fundamental bilim beruvchi dastur.',
      sortOrder: 2,
    },
  ]).onConflictDoNothing();

  // 5. Rahbariyat
  await db.insert(schema.leaders).values([
    {
      fullName: 'Avezov Jasur Baxtiyarovich',
      role: 'Maktab direktori',
      photoUrl: '/images/school/director.jpg',
      bio: "Fizika-matematika fanlari nomzodi, 15 yillik pedagogik va boshqaruv tajribasiga ega.",
      receptionDays: 'Dushanba, Chorshanba: 14:00 - 17:00',
      sortOrder: 1,
    },
    {
      fullName: 'Saparova Gulnora Allayarovna',
      role: "O‘quv ishlari bo‘yicha direktor o‘rinbosari",
      photoUrl: '/images/school/vice-edu.jpg',
      bio: "Oliy toifali matematika fani o'qituvchisi. Ilmiy-metodik kengash rahbari.",
      receptionDays: 'Seshanba, Payshanba: 10:00 - 13:00',
      sortOrder: 2,
    },
    {
      fullName: 'Qurbanov Rustam Davlatovich',
      role: "Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari",
      photoUrl: '/images/school/vice-spirit.jpg',
      bio: "Xalqaro toifadagi yoshlar yetakchisi va ma'naviyat targ'ibotchisi.",
      receptionDays: 'Juma, Shanba: 10:00 - 13:00',
      sortOrder: 3,
    },
  ]).onConflictDoNothing();

  // 6. Sayt umumiy sozlamalari
  await db.insert(schema.siteSettings).values([
    { key: 'school_name', value: "To'rtko'l ixtisoslashtirilgan maktabi", description: 'Maktab to‘liq nomi' },
    { key: 'phone_primary', value: '+998 (61) 512-24-40', description: 'Asosiy qabulxona telefoni' },
    { key: 'phone_secondary', value: '+998 (97) 123-45-67', description: 'Qabul komissiyasi telefoni' },
    { key: 'email', value: 'tortkol@piima.uz', description: 'Rasmiy elektron pochta' },
    { key: 'address', value: 'Qoraqalpog‘iston Respublikasi, To‘rtko‘l tumani, Mustaqillik ko‘chasi, 12-uy', description: 'Maktab yuridik manzili' },
    { key: 'work_hours', value: 'Dushanba - Shanba: 08:00 - 17:00', description: 'Ish vaqtlari' },
    { key: 'admission_portal_url', value: 'https://ariza.piima.uz', description: 'Rasmiy ariza portali havolasi' },
  ]).onConflictDoNothing();

  // 7. Fotoalbomlar
  await db.insert(schema.albums).values([
    {
      slug: 'maktab-binosi',
      title: 'Zamonaviy maktab binosi va sharoitlar',
      description: 'Maktabimizning tashqi ko‘rinishi, zamonaviy jihozlangan o‘quv korpusi va sport maydoni.',
      coverImage: '/images/school/campus.jpg',
      sortOrder: 1,
    },
    {
      slug: 'laboratoriyalar',
      title: 'Ilmiy laboratoriyalar va amaliyot',
      description: 'Fizika, kimyo va biologiya laboratoriyalarida olib borilayotgan amaliy mashg‘ulotlar.',
      coverImage: '/images/school/lab.jpg',
      sortOrder: 2,
    },
  ]).onConflictDoNothing();

  console.log('✅ Real school data seeded successfully!');
  await client.end();
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
