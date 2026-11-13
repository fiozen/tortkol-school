import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Real fallback data if Supabase keys are not set yet
const fallbackPosts = [
  {
    id: 1,
    slug: 'xalqaro-olimpiada-natijalari',
    type: 'news',
    title: "O‘quvchilarimiz Xalqaro olimpiadada munosib ishtirok etib sovrinli o'rinlarni egallashdi",
    excerpt: "Maktabimiz iqtidorli o‘quvchilari matematika va biologiya fanlari bo‘yicha xalqaro musobaqalarda yuqori natijalarni qayd etishdi.",
    content: "Maktabimizning iqtidorli yoshlari mamlakatimiz sharafini xalqaro maydonda munosib himoya qilishda davom etmoqda. Joriy yilning noyabr oyida o‘tkazilgan xalqaro tanlovda o‘quvchilarimiz matematika va biologiya fanlari bo‘yicha yuqori intellektual salohiyat ko‘rsatib, faxrli o‘rinlarga sazovor bo‘lishdi.",
    cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    category: 'Olimpiada',
    published_at: '2026-11-10T08:00:00Z',
    status: 'published',
  },
  {
    id: 2,
    slug: 'zamonaviy-laboratoriya-mashgulotlari',
    type: 'education',
    title: "Tabiiy fanlar yo‘nalishida yangi amaliy laboratoriya darslari boshlandi",
    excerpt: "Kimyo va biologiya laboratoriyalarida o'quvchilar mustaqil ilmiy tajriba va tahlillar o'tkazmoqdalar.",
    content: "O‘quvchilarimiz nazariy bilimlarni mustahkamlash maqsadida maktabning yangi kimyoviy va biologik laboratoriyalarida mustaqil tadqiqotlar olib bormoqdalar. Darslar zamonaviy mikroskoplar, spektral asboblar va xavfsiz reaktivlar yordamida o‘tkazilmoqda.",
    cover_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    category: "Ta'lim",
    published_at: '2026-11-05T10:30:00Z',
    status: 'published',
  },
  {
    id: 3,
    slug: 'ingliz-tili-va-ielts-seminari',
    type: 'news',
    title: "Maktabimizda xalqaro ta'lim imkoniyatlari bo'yicha maxsus seminar tashkil etildi",
    excerpt: "Xorijiy nufuzli oliygohlarga grant asosida qabul qilinish va til sertifikatlariga tayyorgarlik ko'nikmalari muhokama qilindi.",
    content: "Seminar davomida o‘quvchilarga dunyoning yetakchi universitetlariga kirish talablari, xalqaro sertifikatlar (IELTS, SAT) olish sirlari va stipendiya dasturlari haqida atroflicha ma’lumot berildi.",
    cover_image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    category: 'Seminar',
    published_at: '2026-10-28T14:00:00Z',
    status: 'published',
  },
];

// In-memory posts array for fallback/demo
let activePosts = [...fallbackPosts];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('posts').select('*, categories(name)').eq('status', 'published');
      if (type) query = query.eq('type', type);
      if (slug) query = query.eq('slug', slug);

      const { data, error } = await query.order('published_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return NextResponse.json({ posts: activePosts });
      }

      return NextResponse.json({ posts: data });
    }

    // Fallback data
    let filtered = [...activePosts];
    if (type) filtered = filtered.filter(p => p.type === type);
    if (slug) filtered = filtered.filter(p => p.slug === slug);

    return NextResponse.json({ posts: filtered, isLiveDatabase: false });
  } catch (err) {
    return NextResponse.json({ posts: activePosts, error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, type = 'news', status = 'published', coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Sarlavha va matn talab qilinadi' }, { status: 400 });
    }

    // Slug yaratish (o'zbek lotin harflari uchun)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('posts').insert({
        slug,
        title,
        excerpt: excerpt || title.slice(0, 160),
        content,
        type,
        status,
        cover_image: coverImage || null,
        published_at: new Date().toISOString(),
      }).select().single();

      if (error) {
        console.error('Post insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Fon tarjima topshiriqlarini yaratish (QQ, RU, EN)
      const locales = ['qq', 'ru', 'en'];
      const jobs = locales.flatMap(loc => [
        {
          entity_type: 'post',
          entity_id: data.id,
          field_name: 'title',
          source_text: title,
          source_locale: 'uz',
          status: 'pending',
        },
        {
          entity_type: 'post',
          entity_id: data.id,
          field_name: 'content',
          source_text: content,
          source_locale: 'uz',
          status: 'pending',
        },
      ]);

      await supabase.from('translation_jobs').insert(jobs);

      return NextResponse.json({ 
        success: true, 
        post: data, 
        message: "Post muvaffaqiyatli saqlandi va avto-tarjima navbatiga qo'shildi!" 
      });
    }

    // Demo rejimida
    const createdDemoPost = {
      id: Date.now(),
      slug,
      title,
      excerpt: excerpt || title.slice(0, 160),
      content,
      type,
      status,
      category: type === 'education' ? "Ta'lim" : 'Yangilik',
      cover_image: coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      published_at: new Date().toISOString(),
    };
    activePosts.unshift(createdDemoPost);

    return NextResponse.json({
      success: true,
      message: "Post muvaffaqiyatli saqlandi va fonda tarjima navbatiga qo'shildi!",
      post: createdDemoPost,
      slug,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID talab qilinadi' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    activePosts = activePosts.filter(p => String(p.id) !== String(id));

    return NextResponse.json({ success: true, message: "Post muvaffaqiyatli o'chirildi" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}
