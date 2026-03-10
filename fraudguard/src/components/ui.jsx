/**
 * FraudGuard — Shared UI Atoms
 * Chip, Pill, Btn, Inp, Card, Divider, Toggle, Hdr, Gauge, MiniGauge
 */
import { C, riskColor } from '../styles/tokens'

// ── Section header ──────────────────────────────────────────────────────────
export function Hdr({ title, onBack, right, light }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 18px 14px' }}>
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: 12,
            background: light ? '#ffffff30' : C.border,
            border: 'none', cursor: 'pointer', fontSize: 16,
            color: light ? '#fff' : C.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >←</button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      <span style={{ fontWeight: 800, fontSize: 16, color: light ? '#fff' : C.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </span>
      {right || <div style={{ width: 36 }} />}
    </div>
  )
}

// ── Status chip ─────────────────────────────────────────────────────────────
export function Chip({ color, bg, children }) {
  return (
    <span style={{
      background: bg, color,
      border: `1px solid ${color}33`,
      padding: '3px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, display: 'inline-block',
    }}>
      {children}
    </span>
  )
}

// ── Filter pill ─────────────────────────────────────────────────────────────
export function Pill({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
        background: on ? C.blue : '#fff',
        border: `1.5px solid ${on ? C.blue : C.border}`,
        color: on ? '#fff' : C.textMd,
        fontSize: 12, fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'all .2s',
      }}
    >
      {children}
    </button>
  )
}

// ── Primary / variant button ────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary: { background: `linear-gradient(135deg,${C.blue},${C.blueDk})`,           color: '#fff', border: 'none', boxShadow: `0 6px 20px ${C.blue}44` },
  danger:  { background: 'linear-gradient(135deg,#EF4444,#DC2626)',                  color: '#fff', border: 'none', boxShadow: '0 6px 20px #EF444444' },
  outline: { background: '#fff',                                                      color: C.blue, border: `1.5px solid ${C.blue}` },
  ghost:   { background: C.blueLt,                                                   color: C.blue, border: `1.5px solid ${C.border}` },
  success: { background: 'linear-gradient(135deg,#10B981,#059669)',                  color: '#fff', border: 'none', boxShadow: '0 6px 20px #10B98144' },
}

export function Btn({ onClick, children, variant = 'primary', style: s = {}, disabled = false }) {
  return (
    <button
      onClick={disabled ? null : onClick}
      style={{
        ...BTN_VARIANTS[variant],
        padding: '13px 22px', borderRadius: 14, fontSize: 15, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        width: '100%', transition: 'transform .15s',
        letterSpacing: '-.2px', ...s,
      }}
      onMouseDown={(e) => !disabled && (e.target.style.transform = 'scale(.97)')}
      onMouseUp={(e)   => !disabled && (e.target.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  )
}

// ── Labelled text input ─────────────────────────────────────────────────────
export function Inp({ label, type = 'text', value, onChange, placeholder, icon, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: C.textMd, fontSize: 12, marginBottom: 5, fontWeight: 600 }}>{label}</div>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: '#fff',
            border: `1.5px solid ${C.border}`, borderRadius: 13,
            padding: icon ? '13px 13px 13px 42px' : '13px 14px',
            color: C.text, fontSize: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            outline: 'none', boxShadow: '0 1px 4px #1D6FEB08',
            transition: 'border-color .2s, box-shadow .2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = C.blue; e.target.style.boxShadow = `0 0 0 3px ${C.blue}18` }}
          onBlur={(e)  => { e.target.style.borderColor = C.border; e.target.style.boxShadow = '0 1px 4px #1D6FEB08' }}
        />
      </div>
      {hint && <div style={{ color: C.textSm, fontSize: 11, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

// ── White card ──────────────────────────────────────────────────────────────
export function Card({ children, style: s = {}, shadow = true }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18, padding: 16,
      border: `1px solid ${C.border}`,
      boxShadow: shadow ? '0 2px 12px #1D6FEB0A' : 'none',
      ...s,
    }}>
      {children}
    </div>
  )
}

// ── Horizontal rule ─────────────────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '8px 0' }} />
}

// ── iOS-style toggle switch ─────────────────────────────────────────────────
export function Toggle({ on, onChange, accent = C.blue }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: 'pointer',
        background: on ? accent : '#CBD5E1',
        position: 'relative', transition: 'background .25s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left .25s', boxShadow: '0 1px 4px #0004',
      }} />
    </div>
  )
}

// ── Reusable toggle row for settings lists ──────────────────────────────────
import { useState } from 'react'

export function ToggleRow({ label, defaultOn, accent = C.blue, warn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.border}` }}>
      <div>
        <div style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{label}</div>
        {warn && !on && <div style={{ color: C.yellow, fontSize: 11, marginTop: 1 }}>⚠ We recommend turning this on</div>}
      </div>
      <Toggle on={on} onChange={setOn} accent={accent} />
    </div>
  )
}

// ── Semicircular fraud gauge ─────────────────────────────────────────────────
export function Gauge({ score, size = 160 }) {
  const color = riskColor(score)
  const r = size * 0.4
  const cx = size / 2
  const cy = size * 0.55
  const pct  = score / 100
  const dash  = pct * (Math.PI * r)
  const total = Math.PI * r

  return (
    <div style={{ position: 'relative', width: size, height: size * 0.6, margin: '0 auto' }}>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.border} strokeWidth={size * 0.065} strokeLinecap="round" />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={size * 0.065} strokeLinecap="round"
          strokeDasharray={`${dash} ${total}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)' }}
        />
        <circle
          cx={cx + Math.cos(Math.PI * (1 - pct)) * r}
          cy={cy - Math.sin(Math.PI * pct) * r}
          r={size * 0.04} fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{score}%</div>
        <div style={{ fontSize: size * 0.09, color: C.textSm, fontWeight: 600, marginTop: 2 }}>fraud risk</div>
      </div>
    </div>
  )
}

// ── Compact mini gauge for transaction cards ─────────────────────────────────
export function MiniGauge({ score }) {
  const color = riskColor(score)
  return (
    <div style={{ position: 'relative', width: 60, height: 32 }}>
      <svg width="60" height="32" viewBox="0 0 60 32">
        <path d="M 6 30 A 24 24 0 0 1 54 30" fill="none" stroke={C.border} strokeWidth="6" strokeLinecap="round" />
        <path d="M 6 30 A 24 24 0 0 1 54 30" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 75.4} 75.4`} />
      </svg>
      <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', color, fontWeight: 800, fontSize: 10 }}>
        {score}%
      </div>
    </div>
  )
}
