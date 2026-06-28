import { cookies } from 'next/headers';
import { redis } from './redis';

export async function createSession(email: string) {
  // We'll just generate a random token
  const token = crypto.randomUUID();
  
  // Store session in redis for 30 days
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
  await redis.set(`session:${token}`, email, { ex: 60 * 60 * 24 * 30 });
  
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  
  const email = await redis.get<string>(`session:${token}`);
  return email;
}

export async function createAdminSession() {
  const token = crypto.randomUUID();
  await redis.set(`admin_session:${token}`, 'admin', { ex: 60 * 60 * 24 * 1 }); // 1 day
  
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 1,
  });
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  
  const val = await redis.get<string>(`admin_session:${token}`);
  return val === 'admin';
}
