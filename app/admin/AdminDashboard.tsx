'use client';

import { useState } from 'react';
import type { EnrichedItem } from '@/lib/items';

export default function AdminDashboard({ initialItems }: { initialItems: EnrichedItem[] }) {
  const [items, setItems] = useState<EnrichedItem[]>(initialItems);
  const [loading, setLoading] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EnrichedItem>>({
    id: '', name: '', description: '', link: '', imageUrl: '', price: 0, source: '', isPrenatal: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure ID is generated if new
    const itemToSave = {
      ...formData,
      id: formData.id || `item-${Date.now()}`
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToSave),
      });

      if (res.ok) {
        const { item } = await res.json();
        // Update local state
        setItems(prev => {
          const exists = prev.find(i => i.id === item.id);
          if (exists) return prev.map(i => i.id === item.id ? { ...item, state: exists.state } : i);
          return [...prev, { ...item, state: { status: 'available' } }];
        });
        setIsEditing(false);
      } else {
        alert('Errore durante il salvataggio');
      }
    } catch (error) {
      alert('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (e) {
      alert("Errore durante l'eliminazione");
    } finally {
      setLoading(false);
    }
  };

  const handleResetStatus = async (id: string) => {
    if (!confirm('Vuoi resettare lo stato a "Disponibile"?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'available' }),
      });
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === id ? { ...i, state: { status: 'available' } } : i));
      }
    } catch (e) {
      alert('Errore');
    } finally {
      setLoading(false);
    }
  };

  const editItem = (item: EnrichedItem) => {
    setFormData(item);
    setIsEditing(true);
  };

  const createNewItem = () => {
    setFormData({ id: '', name: '', description: '', link: '', imageUrl: '', price: 0, source: '', isPrenatal: false });
    setIsEditing(true);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--pink-500)' }}>Pannello Admin</h1>
        {!isEditing && (
          <button className="btn-primary" onClick={createNewItem}>+ Aggiungi Elemento</button>
        )}
      </div>

      {isEditing && (
        <div className="card mb-8">
          <h2 className="mb-4">{formData.id ? 'Modifica Elemento' : 'Nuovo Elemento'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mb-2" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>Nome</label>
              <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="mb-2" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>Descrizione</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div>
              <label className="mb-2" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>Link</label>
              <input type="url" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>

            <div>
              <label className="mb-2" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>URL Immagine</label>
              <input type="url" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>

            <div>
              <label className="mb-2" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>Prezzo (€)</label>
              <input type="number" step="0.01" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>

            <div>
              <label className="mb-2" style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>Fonte (es. Amazon)</label>
              <input type="text" value={formData.source || ''} onChange={e => setFormData({...formData, source: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="isPrenatal" 
                checked={formData.isPrenatal || false} 
                onChange={e => setFormData({...formData, isPrenatal: e.target.checked})}
                style={{ width: 'auto' }}
              />
              <label htmlFor="isPrenatal" style={{ fontSize: '14px', fontWeight: 600 }}>È la lista Prenatal principale?</label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Annulla</button>
              <button type="submit" className="btn-primary flex items-center justify-center min-w-[120px]" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Salva'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--pink-100)' }}>
              <th style={{ padding: '12px 8px' }}>Nome</th>
              <th style={{ padding: '12px 8px' }}>Prezzo</th>
              <th style={{ padding: '12px 8px' }}>Stato</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--pink-100)' }}>
                <td style={{ padding: '16px 8px' }}>
                  <div style={{ fontWeight: 500 }}>{item.name} {item.isPrenatal && '⭐'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.source}</div>
                </td>
                <td style={{ padding: '16px 8px' }}>
                  {item.price ? `€${item.price.toFixed(2)}` : '-'}
                </td>
                <td style={{ padding: '16px 8px' }}>
                  <span className={`badge badge-${item.state.status}`}>
                    {item.state.status === 'available' ? 'Disponibile' : 
                     item.state.status === 'reserved' ? 'In stand-by' : 'Acquistato'}
                  </span>
                </td>
                <td style={{ padding: '16px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {item.state.status !== 'available' && (
                    <button 
                      onClick={() => handleResetStatus(item.id)}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#f0f0f0', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                    >
                      Reset
                    </button>
                  )}
                  <button 
                    onClick={() => editItem(item)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--pink-100)', color: 'var(--pink-500)', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    Modifica
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ffe5e5', color: '#d32f2f', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Nessun elemento presente. Aggiungine uno!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
