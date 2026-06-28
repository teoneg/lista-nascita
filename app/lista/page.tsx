import { getSessionEmail } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientRegistry from './ClientRegistry';

export default async function ListaNascitaPage() {
  const email = await getSessionEmail();
  
  if (!email) {
    redirect('/');
  }

  // Fetch initial items
  // Since we are using App Router, we can fetch from our own API using absolute URL or just call the DB layer directly
  // We'll call the DB layer directly since we're in a server component
  const { getAllItems } = await import('@/lib/items');
  const items = await getAllItems();

  return (
    <div className="container" style={{ padding: '40px 20px', paddingBottom: '80px' }}>
      <header className="mb-8" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--pink-500)', fontSize: '2rem' }}>La nostra lista 🎀</h1>
      </header>

      <ClientRegistry initialItems={items} currentUserEmail={email} />
    </div>
  );
}
