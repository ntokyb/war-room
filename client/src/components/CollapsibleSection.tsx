import { useState } from 'react'

export default function CollapsibleSection({ label, icon, color, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: '#111118',
          border: '1px solid #1e1e30',
          borderRadius: '8px',
          padding: '14px 18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#888',
          fontSize: '12px',
          letterSpacing: '2px',
        }}
      >
        <span style={{ color }}>
          {icon} {label}
        </span>
        <span style={{ color: '#444', fontSize: '16px' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div
          style={{
            border: '1px solid #1e1e30',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            background: '#0d0d16',
            padding: '18px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
