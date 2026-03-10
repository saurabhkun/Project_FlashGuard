import { C } from '../styles/tokens'

const TABS = [
  { id: 'home',     icon: '⊞', label: 'Home'     },
  { id: 'scan',     icon: '◎', label: 'Scan'     },
  { id: 'history',  icon: '↻', label: 'History'  },
  { id: 'security', icon: '🛡', label: 'Security' },
  { id: 'profile',  icon: '◯', label: 'Profile'  },
]

export default function BottomNav({ screen, setScreen }) {
  return (
    <div
      className="nav-safe"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 4px 20px',
        background: '#fff',
        borderTop: `1px solid ${C.border}`,
        boxShadow: '0 -4px 20px #1D6FEB0C',
        flexShrink: 0,
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => setScreen(t.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            color: screen === t.id ? C.blue : C.textSm,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: '3px 12px',
            transition: 'color .18s',
            minWidth: 44,
          }}
        >
          <span
            style={{
              fontSize: 22,
              transform: screen === t.id ? 'scale(1.18)' : 'scale(1)',
              transition: 'transform .2s cubic-bezier(.34,1.56,.64,1)',
              display: 'block',
            }}
          >
            {t.icon}
          </span>
          <span style={{ fontSize: 10, fontWeight: screen === t.id ? 700 : 500, letterSpacing: '-.1px' }}>
            {t.label}
          </span>
          {screen === t.id && (
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, marginTop: 1 }} />
          )}
        </button>
      ))}
    </div>
  )
}
