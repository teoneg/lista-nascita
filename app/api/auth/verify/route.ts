import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Codice mancante' }, { status: 400 });
    }

    const email = await redis.get<string>(`code:${code.toUpperCase()}`);

    if (!email) {
      return NextResponse.json({ error: 'Codice non valido o scaduto' }, { status: 400 });
    }

    // Create session
    await createSession(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
