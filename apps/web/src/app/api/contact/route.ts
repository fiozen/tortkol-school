import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(3, "Ism-familiya kamida 3 belgidan iborat bo'lishi kerak"),
  phone: z.string().min(7, "Telefon raqam noto'g'ri"),
  subject: z.string().min(2, "Mavzu kiritilishi shart"),
  message: z.string().min(5, "Xabar matni kamida 5 belgidan iborat bo'lishi kerak"),
});

let inMemoryMessages = [
  {
    id: 1,
    full_name: 'Azamat Yusupov',
    phone: '+998 (90) 123-45-67',
    subject: '7-sinfga qabul sanalari',
    message: "Assalomu alaykum! O'g'lim 6-sinfni a'lo baholarga tamomlayapti. 2026-yilgi qabul imtihonlari qaysi sanalarda o'tkaziladi va qanday hujjatlar talab etiladi?",
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 2,
    full_name: 'Dilnoza Karimova',
    phone: '+998 (91) 456-78-90',
    subject: "Matematika va Ingliz tili to'garaklari",
    message: "Assalomu alaykum, maktabda darsdan tashqari xalqaro fan olimpiadalariga tayyorgarlik to'garaklari mavjudmi? Qatnashish shartlari qanday?",
    status: 'read',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 3,
    full_name: 'Bobur Mansurov',
    phone: '+998 (97) 789-01-23',
    subject: "Yotoqxona va stipendiya shartlari",
    message: "To'rtko'l tumani chekka hududidan keladigan o'quvchilar uchun yotoqxona va issiq ovqat ta'minoti qanday yo'lga qo'yilgan?",
    status: 'new',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ messages: data });
      }
    }

    return NextResponse.json({ messages: inMemoryMessages });
  } catch (err: any) {
    return NextResponse.json({ messages: inMemoryMessages, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const newMsg = {
      id: Date.now(),
      full_name: validated.fullName,
      phone: validated.phone,
      subject: validated.subject,
      message: validated.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('contact_messages').insert({
        full_name: validated.fullName,
        phone: validated.phone,
        subject: validated.subject,
        message: validated.message,
        status: 'new',
      });

      if (error) {
        console.error('Supabase contact insert error:', error);
      }
    }

    inMemoryMessages.unshift(newMsg);

    return NextResponse.json({ 
      success: true, 
      message: 'Murojaatingiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog‘lanamiz!' 
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || "Ma'lumotlar noto'g'ri" }, { status: 400 });
    }
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID va status talab qilinadi' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    }

    inMemoryMessages = inMemoryMessages.map((m) => (m.id === id ? { ...m, status } : m));

    return NextResponse.json({ success: true, message: 'Status yangilandi' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}
