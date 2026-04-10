export default function CodeBlock({ children }) {
  return (
    <pre
      style={{
        margin: 0,
        background: '#050508',
        border: '1px solid #1a1a2e',
        borderRadius: '6px',
        padding: '16px',
        fontSize: '12px',
        color: '#a8d8a8',
        lineHeight: 1.8,
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
      }}
    >
      {children}
    </pre>
  )
}
