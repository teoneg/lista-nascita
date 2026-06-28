import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === adminPassword) {
      await createAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Password non corretta' }, { status: 401 });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
