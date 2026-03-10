/**
 * FraudGuard Design Tokens
 * Single source of truth for all colours used across the app.
 */
export const C = {
  // Brand blues
  blue:     '#1D6FEB',
  blueDk:   '#1558C8',
  blueLt:   '#EBF2FF',
  blueMid:  '#DBEAFE',

  // Neutrals
  white:    '#FFFFFF',
  bg:       '#F0F4FD',
  bgCard:   '#FFFFFF',
  border:   '#DDE6F5',
  text:     '#0F172A',
  textMd:   '#475569',
  textSm:   '#8898AA',

  // Status
  green:    '#0C9B6E',
  greenLt:  '#ECFDF5',
  yellow:   '#D97706',
  yellowLt: '#FFFBEB',
  red:      '#DC2626',
  redLt:    '#FEF2F2',

  // Accent
  purple:   '#7C3AED',
  purpleLt: '#F5F3FF',
}

// ── Risk helpers ──────────────────────────────────────────
export const riskColor  = (s) => s < 35 ? C.green   : s < 65 ? C.yellow   : C.red
export const riskBg     = (s) => s < 35 ? C.greenLt : s < 65 ? C.yellowLt : C.redLt
export const riskLabel  = (s) => s < 35 ? 'Low'     : s < 65 ? 'Medium'   : 'High'

export const statusColor = (st) =>
  st === 'Safe' ? '#0C9B6E' : st === 'Suspicious' ? '#D97706' : '#DC2626'

export const statusBg = (st) =>
  st === 'Safe' ? C.greenLt : st === 'Suspicious' ? C.yellowLt : C.redLt
