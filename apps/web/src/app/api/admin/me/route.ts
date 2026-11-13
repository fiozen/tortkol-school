import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || !session.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString('utf8'));
    return NextResponse.json({
      authenticated: true,
      user: {
        username: data.user || 'admin',
        role: 'Bosh administrator',
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
