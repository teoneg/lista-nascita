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
    let code = await redis.hget<string>(`user:${email}`, 'code');

    if (!code) {
      // Generate a new 6-character alphanumeric code
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Store user and code mapping
      await redis.hset(`user:${email}`, { code, createdAt: Date.now() });
      await redis.set(`code:${code}`, email);
    }

    // Send email
    const result = await sendCodeEmail(email, code);

    if (!result.success) {
      return NextResponse.json({ error: "Errore durante l'invio dell'email. Riprova più tardi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request code error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
