'use client';

import { useState } from 'react';
import type { EnrichedItem } from '@/lib/items';
import ItemCard from '@/components/ItemCard';
import PrenatalCard from '@/components/PrenatalCard';

export default function ClientRegistry({ 
  initialItems, 
  currentUserEmail 
}: { 
  initialItems: EnrichedItem[];
  currentUserEmail: string;
}) {
  const [items, setItems] = useState<EnrichedItem[]>(initialItems);
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const prenatalItem = items.find(i => i.isPrenatal);
  const regularItems = items.filter(i => !i.isPrenatal);

  const displayedItems = filter === 'available' 
    ? regularItems.filter(i => i.state.status === 'available')
    : regularItems;

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/items/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, state: data.state } : item
        ));
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  return (
    <div>
      {prenatalItem && (
        <div className="mb-8">
          <PrenatalCard item={prenatalItem} />
        </div>
      )}

      <div className="mb-6 flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Altri Desideri</h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFilter('all')}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Tutti
          </button>
          <button 
            className={filter === 'available' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFilter('available')}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Disponibili
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayedItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            currentUserEmail={currentUserEmail}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
        {displayedItems.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            Nessun elemento trovato.
          </div>
        )}
      </div>
    </div>
  );
}
