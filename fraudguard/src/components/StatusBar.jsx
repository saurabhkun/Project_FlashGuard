import { useClock } from '../hooks/useClock'
import { C } from '../styles/tokens'

/**
 * iOS-style status bar with live clock.
 * Pass light={true} for screens with a dark/blue hero header.
 */
export default function StatusBar({ light = false }) {
  const time = useClock()

  return (
    <div
      className="sb-pad"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '44px 22px 6px',
        fontSize: 12,
        fontWeight: 700,
        color: light ? 'rgba(255,255,255,.92)' : C.textMd,
        letterSpacing: '-.2px',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800 }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
        <span>●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </div>
    </div>
  )
}
