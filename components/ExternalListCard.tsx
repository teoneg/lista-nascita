import type { EnrichedItem } from '@/lib/items';

export default function ExternalListCard({ item }: { item: EnrichedItem }) {
  // Determine distinct branding colors based on the source for a subtle theme
  const getSourceStyles = (source?: string) => {
    const src = source?.toLowerCase() || '';
    if (src.includes('amazon')) {
      return {
        badgeBg: '#FFF3E0',
        badgeColor: '#E65100',
        buttonBg: '#232F3E',
        buttonHoverBg: '#37475A',
        borderColor: '#FFE0B2'
      };
    }
    if (src.includes('prenatal')) {
      return {
        badgeBg: '#FCE4EC',
        badgeColor: '#C2185B',
        buttonBg: 'var(--pink-500)',
        buttonHoverBg: 'var(--pink-400)',
        borderColor: 'var(--pink-200)'
      };
    }
    // Default fallback styles
    return {
      badgeBg: 'var(--bg-rose-light)',
      badgeColor: 'var(--pink-500)',
      buttonBg: 'var(--pink-500)',
      buttonHoverBg: 'var(--pink-400)',
      borderColor: 'var(--pink-100)'
    };
  };

  const styles = getSourceStyles(item.source);

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px',
      backgroundColor: 'var(--bg-card)',
      border: `2px dashed ${styles.borderColor}`,
      borderRadius: '20px',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            backgroundColor: styles.badgeBg, 
            color: styles.badgeColor,
            padding: '4px 12px',
            borderRadius: '999px'
          }}>
            Lista Ufficiale {item.source || 'Esterna'}
          </span>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {item.name}
          </h3>
          {item.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {item.description}
            </p>
          )}
        </div>
      </div>
      
      {item.imageUrl && (
        <div style={{ 
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '8px 0'
        }}>
          <img 
            src={item.imageUrl} 
            alt={item.source || 'Logo'} 
            style={{ maxHeight: '100%', maxWidth: '80%', objectFit: 'contain' }}
          />
        </div>
      )}

      <div style={{ marginTop: '12px' }}>
        <a 
          href={item.link || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary text-center"
          style={{ 
            display: 'block', 
            textDecoration: 'none',
            backgroundColor: styles.buttonBg,
            boxShadow: 'none',
            fontWeight: 600
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = styles.buttonHoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = styles.buttonBg;
          }}
        >
          Sfoglia la lista su {item.source || 'Negozio'} →
        </a>
      </div>
    </div>
  );
}
