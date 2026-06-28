import { useState } from 'react';
import type { EnrichedItem } from '@/lib/items';

export default function ItemCard({ 
  item, 
  currentUserEmail,
  onUpdateStatus 
}: { 
  item: EnrichedItem;
  currentUserEmail: string;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  
  const statusLabels = {
    available: 'Disponibile',
    reserved: 'In stand-by',
    purchased: 'Acquistato'
  };

  const isReservedByMe = item.state.reservedByEmail === currentUserEmail;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await onUpdateStatus(item.id, newStatus);
    setLoading(false);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {item.imageUrl && (
        <div style={{ 
          height: '200px', 
          marginBottom: '16px', 
          borderRadius: '8px', 
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            loading="lazy"
          />
        </div>
      )}
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, paddingRight: '8px' }}>{item.name}</h3>
          <span className={`badge badge-${item.state.status}`}>
            {statusLabels[item.state.status]}
          </span>
        </div>
        
        {item.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
            {item.description}
          </p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px' }}>
          {item.price && (
            <span style={{ fontWeight: 600, color: 'var(--pink-500)', fontSize: '1.1rem' }}>
              €{item.price.toFixed(2)}
            </span>
          )}
          {item.source && (
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              da {item.source}
            </span>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {item.link && (
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary text-center"
            style={{ padding: '8px', fontSize: '0.95rem' }}
          >
            Vedi prodotto
          </a>
        )}

        {/* Actions based on state */}
        {item.state.status === 'available' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
              onClick={() => handleStatusChange('reserved')}
              disabled={loading}
            >
              Ci penso
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
              onClick={() => handleStatusChange('purchased')}
              disabled={loading}
            >
              Lo prendo!
            </button>
          </div>
        )}

        {item.state.status === 'reserved' && isReservedByMe && (
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '4px 0' }}>
              Hai messo in stand-by questo regalo.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                onClick={() => handleStatusChange('available')}
                disabled={loading}
              >
                Lascio ad altri
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                onClick={() => handleStatusChange('purchased')}
                disabled={loading}
              >
                Fatto, l'ho preso
              </button>
            </div>
          </div>
        )}
        
        {item.state.status === 'reserved' && !isReservedByMe && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'center', margin: '8px 0' }}>
            Qualcuno ci sta pensando...
          </p>
        )}
        
        {item.state.status === 'purchased' && isReservedByMe && (
          <p style={{ fontSize: '0.9rem', color: 'var(--pink-500)', textAlign: 'center', margin: '8px 0', fontWeight: 500 }}>
            Grazie per questo regalo! ❤️
          </p>
        )}
        
        {item.state.status === 'purchased' && !isReservedByMe && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'center', margin: '8px 0' }}>
            Già regalato
          </p>
        )}
      </div>
    </div>
  );
}
