import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { sendCodeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 });
    }

    // Check if user already exists
    let code;
    try {
      code = await redis.hget<string>(`user:${email}`, 'code');
    } catch (redisError: any) {
      return NextResponse.json({ error: `Errore di connessione a Redis (Database): ${redisError.message || String(redisError)}` }, { status: 500 });
    }

    try {
      if (!code) {
        // Generate a new 6-character alphanumeric code
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Store user and code mapping
        await redis.hset(`user:${email}`, { code, createdAt: Date.now() });
        await redis.set(`code:${code}`, email);
      }
    } catch (redisWriteError: any) {
      return NextResponse.json({ error: `Errore di scrittura su Redis: ${redisWriteError.message || String(redisWriteError)}` }, { status: 500 });
    }

    // Send email
    let result;
    try {
      result = await sendCodeEmail(email, code);
    } catch (emailError: any) {
      return NextResponse.json({ error: `Errore di invio tramite Resend: ${emailError.message || String(emailError)}` }, { status: 500 });
    }

    if (!result.success) {
      return NextResponse.json({ error: `Errore invio email (Resend): ${result.error || 'Errore generico'}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Request code error:', error);
    return NextResponse.json({ error: `Errore generico del server: ${error.message || String(error)}` }, { status: 500 });
  }
}
