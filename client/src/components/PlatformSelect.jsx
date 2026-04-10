import { PLATFORMS } from '../constants/platforms.js'

export default function PlatformSelect({ onSelect }) {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: '8px', color: '#00ff88', fontSize: '13px', lineHeight: 1.8 }}>
        Pick an assessment platform. Problems, tone, and scoring notes will match that style.
        <br />
        <span style={{ color: '#555' }}>Then choose language, category, and difficulty.</span>
      </div>
      <div style={{ height: '1px', background: '#1e1e2e', margin: '24px 0' }} />
      <div
        style={{
          color: '#444',
          fontSize: '11px',
          letterSpacing: '3px',
          marginBottom: '12px',
        }}
      >
        PLATFORM
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '10px',
        }}
      >
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            style={{
              background: '#111118',
              border: `1px solid #1e1e30`,
              borderRadius: '8px',
              padding: '16px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              color: '#555',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${p.color}55`
              e.currentTarget.style.background = `${p.color}10`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1e1e30'
              e.currentTarget.style.background = '#111118'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '8px', color: p.color }}>{p.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: p.color, marginBottom: '6px' }}>
              {p.name}
            </div>
            <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.6 }}>{p.tagline}</div>
            <div style={{ fontSize: '10px', color: '#333', marginTop: '10px' }}>~{p.timeLimit} min</div>
          </button>
        ))}
      </div>
    </main>
  )
}
