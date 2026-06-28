import AuthGate from '@/components/AuthGate';

export default function Home() {
  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <header className="text-center" style={{ padding: '60px 0 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--pink-500)' }}>
          Benvenuti! 🎀
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Stiamo preparando tante cose belle per l'arrivo della nostra bimba. 
          Qui abbiamo raccolto alcuni pensieri e desideri che ci farebbe piacere condividere con voi.
        </p>
      </header>

      <main>
        <AuthGate />
      </main>
    </div>
  );
}
