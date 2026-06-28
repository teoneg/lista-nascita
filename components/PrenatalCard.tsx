import type { EnrichedItem } from '@/lib/items';

export default function PrenatalCard({ item }: { item: EnrichedItem }) {
  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px',
      backgroundColor: 'var(--bg-rose-light)',
      border: '1px solid var(--pink-200)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--pink-500)', marginBottom: '8px' }}>
            {item.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {item.description || 'La nostra lista principale con tanti articoli selezionati per la bimba.'}
          </p>
        </div>
        
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt="Prenatal Logo" 
            style={{ height: '60px', objectFit: 'contain' }}
          />
        )}
      </div>
      
      <div style={{ marginTop: '8px' }}>
        <a 
          href={item.link || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          Vai alla lista su Prenatal
        </a>
      </div>
    </div>
  );
}
