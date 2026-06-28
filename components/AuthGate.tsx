'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGate() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Inserisci un'email valida");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep('code');
      } else {
        setError(data.error || 'Qualcosa è andato storto');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setError('Inserisci il codice completo');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push('/lista');
        router.refresh(); // Refresh to clear state
      } else {
        setError(data.error || 'Codice non valido');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
      {step === 'email' ? (
        <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
          <h2 className="text-center">Accedi alla lista</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Inserisci la tua email per ricevere un codice di accesso personale.
          </p>
          
          <div>
            <input
              type="email"
               placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {error && <p style={{ color: 'var(--pink-500)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
          
          <button type="submit" className="btn-primary flex justify-center items-center gap-2" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Invia Codice'}
          </button>

          <button 
            type="button" 
            onClick={() => { setError(''); setStep('code'); }} 
            className="btn-secondary mt-2"
            disabled={loading}
          >
            Ho già un codice
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <h2 className="text-center">Inserisci il codice</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            {email ? (
              <>Ti abbiamo inviato un codice a <strong>{email}</strong></>
            ) : (
              <>Inserisci il codice personale che ti abbiamo inviato via email.</>
            )}
          </p>
          
          <div>
            <input
              type="text"
              placeholder="Codice a 6 caratteri"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              required
              style={{ textAlign: 'center', letterSpacing: '4px', textTransform: 'uppercase' }}
            />
          </div>
          
          {error && <p style={{ color: 'var(--pink-500)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
          
          <button type="submit" className="btn-primary flex justify-center items-center gap-2" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Entra'}
          </button>
          
          <button 
            type="button" 
            onClick={() => { setError(''); setStep('email'); }} 
            className="btn-secondary mt-4"
            disabled={loading}
          >
            {email ? 'Modifica email' : 'Richiedi un codice'}
          </button>
        </form>
      )}
    </div>
  );
}
