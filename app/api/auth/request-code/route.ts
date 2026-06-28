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
      const errorDetail = typeof result.error === 'object' ? JSON.stringify(result.error) : result.error;
      return NextResponse.json({ error: `Errore invio email: ${errorDetail || 'Errore generico'}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Request code error:', error);
    return NextResponse.json({ error: `Errore server: ${error.message || String(error)}` }, { status: 500 });
  }
}
