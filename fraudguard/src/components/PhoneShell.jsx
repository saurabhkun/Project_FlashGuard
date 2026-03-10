import { C } from '../styles/tokens'

/**
 * The outer phone frame shown on desktop / tablet.
 * On real mobile (<520px) the CSS makes it full-screen via .phone-shell.
 */
export default function PhoneShell({ children }) {
  return (
    <div
      className="phone-shell"
      style={{
        width: 390,
        minHeight: 844,
        background: C.bg,
        borderRadius: 52,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 0 0 11px #B0BED4, 0 0 0 13px #8FA4C4, 0 48px 96px -16px #3B5A9644',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Dynamic Island / Notch */}
      <div
        className="phone-notch"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 118,
          height: 34,
          background: '#1A2540',
          borderRadius: '0 0 22px 22px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#2D3F60' }} />
        <div style={{ width: 54, height: 5, borderRadius: 10, background: '#2D3F60' }} />
      </div>

      {/* Decorative side buttons */}
      <div style={{ position: 'absolute', right: -3, top: 120, width: 4, height: 56, background: '#8FA4C4', borderRadius: '0 3px 3px 0' }} />
      <div style={{ position: 'absolute', left: -3, top: 100, width: 4, height: 36, background: '#8FA4C4', borderRadius: '3px 0 0 3px' }} />
      <div style={{ position: 'absolute', left: -3, top: 148, width: 4, height: 36, background: '#8FA4C4', borderRadius: '3px 0 0 3px' }} />

      {children}
    </div>
  )
}
