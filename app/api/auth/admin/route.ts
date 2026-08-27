import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    // Debug: log lengths to detect hidden whitespace issues
    console.log(`[Admin Login] Input length: ${password?.length}, Env length: ${adminPassword.length}, Match: ${password === adminPassword}`);

    if (password?.trim() === adminPassword.trim()) {
      await createAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Password non corretta` }, { status: 401 });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: `Errore: ${error.message || String(error)}` }, { status: 500 });
  }
}
