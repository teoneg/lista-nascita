'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        setError('Password non corretta');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <h2 className="text-center">Admin Login</h2>
          
          <div>
            <input
              type="password"
              placeholder="Password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p style={{ color: 'var(--pink-500)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
          
          <button type="submit" className="btn-primary flex justify-center items-center gap-2" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
