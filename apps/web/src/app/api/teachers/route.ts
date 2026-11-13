import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const fallbackLeaders = [
  {
    id: 1,
    full_name: "Ismailov Fazliddin Baxriddinovich",
    role: "Maktab direktori",
    reception_days: "Dushanba - Chorshanba, 14:00 - 17:00",
    phone: "+998 (61) 512-24-40",
    email: "direktor@tortkol-maktab.uz",
    bio: "Fizika-matematika fanlari nomzodi, 15 yillik ta’lim boshqaruvi va pedagogik tajribaga ega rahbar.",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    full_name: "Utepov Sanjar Shamuratovich",
    role: "O‘quv ishlari bo‘yicha direktor o‘rinbosari",
    reception_days: "Seshanba - Payshanba, 10:00 - 13:00",
    phone: "+998 (61) 512-24-41",
    email: "oquv@tortkol-maktab.uz",
    bio: "Oliy toifali o‘qituvchi, chuqurlashtirilgan davlat ta’lim standartlari koordinatori.",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    full_name: "Davidova Dilrabo Tajibayevna",
    role: "Ixtisos fanlar bo‘yicha direktor o‘rinbosari",
    reception_days: "Chorshanba - Juma, 14:00 - 16:00",
    phone: "+998 (61) 512-24-42",
    email: "ixtisos@tortkol-maktab.uz",
    bio: "Biologiya va kimyo fanlari bo‘yicha xalqaro metodist, laboratoriya mudiri.",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    full_name: "Odiljonov Ulug‘bek Komiljonovich",
    role: "Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari",
    reception_days: "Har kuni, 09:00 - 12:00",
    phone: "+998 (61) 512-24-43",
    email: "manaviyat@tortkol-maktab.uz",
    bio: "Yoshlar tarbiyasi, vatanparvarlik va madaniy-ma’rifiy loyihalar koordinatori.",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  },
];

const fallbackTeachers = [
  {
    id: 1,
    full_name: "Allamuratov Timur Karimovich",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    category: "Oliy toifali o‘qituvchi",
    bio: "12 yillik tajriba. Respublika matematika olimpiadasi g‘oliblari ustozi.",
    subjects: ["Matematika", "Mantiq"],
  },
  {
    id: 2,
    full_name: "Jumaniyazova Malika Baxtiyarovna",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80",
    category: "1-toifali mutaxassis",
    bio: "Xalqaro ilmiy tadqiqotlar va fizik laboratoriyalar kuratori.",
    subjects: ["Fizika", "Astronomiya"],
  },
  {
    id: 3,
    full_name: "Karimov Eldor Rustamovich",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    category: "Oliy toifali o‘qituvchi",
    bio: "Xalqaro kimyo olimpiadasi sovrindori va murabbiyi.",
    subjects: ["Kimyo"],
  },
  {
    id: 4,
    full_name: "Sodiqova Nilufar Shuhratovna",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    category: "1-toifali mutaxassis",
    bio: "Biologiya va genetik amaliyot darslari rahbari.",
    subjects: ["Biologiya"],
  },
  {
    id: 5,
    full_name: "Xolmatov Diyor Mahmudovich",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    category: "Yetakchi mutaxassis",
    bio: "Python, Algoritmlar va Robototexnika to‘garagi rahbari.",
    subjects: ["Informatika", "Robototexnika"],
  },
  {
    id: 6,
    full_name: "Madaminova Zarina Ilhomovna",
    photo_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80",
    category: "Xalqaro toifali (IELTS 8.5)",
    bio: "CEFR va xalqaro til imtihonlariga tayyorlash bo‘yicha yetakchi ekspert.",
    subjects: ["Ingliz tili"],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope'); // 'leaders' | 'teachers'

    if (isSupabaseConfigured && supabase) {
      if (scope === 'leaders') {
        const { data } = await supabase.from('leaders').select('*').order('sort_order', { ascending: true });
        return NextResponse.json({ leaders: data || fallbackLeaders });
      }

      const { data: teachersData } = await supabase.from('teachers').select('*').order('sort_order', { ascending: true });
      return NextResponse.json({ teachers: teachersData || fallbackTeachers });
    }

    if (scope === 'leaders') {
      return NextResponse.json({ leaders: fallbackLeaders, isLiveDatabase: false });
    }

    return NextResponse.json({ teachers: fallbackTeachers, isLiveDatabase: false });
  } catch (err) {
    return NextResponse.json({ leaders: fallbackLeaders, teachers: fallbackTeachers }, { status: 500 });
  }
}
