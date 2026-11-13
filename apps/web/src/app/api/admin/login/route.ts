import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VALID_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const VALID_PASSWORD = process.env.ADMIN_PASSWORD || 'Turtkol2026!';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiritilishi shart' },
        { status: 400 }
      );
    }

    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      // 7 kunlik admin sessiya belgisi yaratish
      const sessionToken = Buffer.from(
        JSON.stringify({
          user: VALID_USERNAME,
          role: 'superadmin',
          time: Date.now(),
        })
      ).toString('base64');

      const cookieStore = await cookies();
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 kun
      });

      return NextResponse.json({
        success: true,
        message: 'Tizimga muvaffaqiyatli kirildi',
      });
    }

    return NextResponse.json(
      { error: 'Login yoki parol noto‘g‘ri!' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
