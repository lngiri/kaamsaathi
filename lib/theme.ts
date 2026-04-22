// =============================================
// KaamSathi Global Theme
// Nepal Flag Colors & Design System
// Change colors here — updates ALL pages!
// =============================================

export const theme = {
  // Primary brand color (Nepal Flag - Crimson Red)
  primary:        '#DC143C',
  primaryDark:    '#A30030',
  primaryLight:   '#FF6B6B',
  primaryText:    '#fff',

  // Secondary / accent (Nepal Flag - Dark Blue)
  secondary:      '#003893',
  secondaryLight: '#0052CC',

  // Status colors
  green:          '#16a34a',
  greenBg:        '#dcfce7',
  amber:          '#d97706',
  amberBg:        '#fef3c7',
  blue:           '#2563eb',
  blueBg:         '#dbeafe',

  // Neutral
  text:           '#1a1a1a',
  muted:          '#666',
  border:         '#e8e8e8',
  bg:             '#f4f6fb',
  bgLight:        '#f9f9f9',
  white:          '#fff',
  dark:           '#1a1a1a',

  // Typography
  fontFamily:     "'Segoe UI', sans-serif",
  radiusSm:       '8px',
  radiusMd:       '12px',
  radiusLg:       '14px',
  radiusXl:       '20px',
  shadow:         '0 2px 12px rgba(0,0,0,0.08)',
  shadowLg:       '0 4px 20px rgba(0,0,0,0.12)',
}

// =============================================
// Reusable button styles
// =============================================
export const btnPrimary: React.CSSProperties = {
  background:   theme.primary,
  color:        '#fff',
  border:       'none',
  borderRadius: theme.radiusMd,
  padding:      '10px 22px',
  fontSize:     '14px',
  fontWeight:   600,
  cursor:       'pointer',
}

export const btnOutline: React.CSSProperties = {
  background:   theme.white,
  color:        theme.text,
  border:       `1.5px solid ${theme.border}`,
  borderRadius: theme.radiusMd,
  padding:      '10px 22px',
  fontSize:     '14px',
  fontWeight:   600,
  cursor:       'pointer',
}

export const btnGhost: React.CSSProperties = {
  background:   'transparent',
  color:        '#fff',
  border:       '2px solid rgba(255,255,255,0.6)',
  borderRadius: theme.radiusMd,
  padding:      '10px 22px',
  fontSize:     '14px',
  fontWeight:   600,
  cursor:       'pointer',
}

// =============================================
// Reusable card style
// =============================================
export const card: React.CSSProperties = {
  background:   theme.white,
  border:       `1.5px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  overflow:     'hidden',
}

// =============================================
// Tag / badge style
// =============================================
export const tagPrimary: React.CSSProperties = {
  background:   theme.primaryLight,
  color:        theme.primary,
  fontSize:     '11px',
  padding:      '3px 9px',
  borderRadius: '10px',
  fontWeight:   500,
}

export const tagGreen: React.CSSProperties = {
  background:   theme.greenBg,
  color:        theme.green,
  fontSize:     '11px',
  padding:      '3px 9px',
  borderRadius: '10px',
  fontWeight:   500,
}

// =============================================
// Navbar style
// =============================================
export const navbar: React.CSSProperties = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'space-between',
  padding:        '0 5%',
  height:         '68px',
  borderBottom:   `1px solid ${theme.border}`,
  position:       'sticky',
  top:            0,
  background:     theme.white,
  zIndex:         100,
  boxShadow:      theme.shadow,
}

// =============================================
// Section styles
// =============================================
export const sectionWhite: React.CSSProperties = {
  padding: '60px 5%',
  background: theme.white,
}

export const sectionGray: React.CSSProperties = {
  padding: '60px 5%',
  background: theme.bgLight,
}

export const sectionRed: React.CSSProperties = {
  padding: '60px 5%',
  background: theme.primary,
  color: '#fff',
}

export const sectionDark: React.CSSProperties = {
  padding: '48px 5%',
  background: theme.dark,
  color: '#ccc',
}

// =============================================
// Section heading
// =============================================
export const sectionTitle: React.CSSProperties = {
  fontSize:     '26px',
  fontWeight:   700,
  textAlign:    'center',
  marginBottom: '6px',
  color:        theme.text,
}

export const sectionSub: React.CSSProperties = {
  textAlign:    'center',
  color:        theme.muted,
  fontSize:     '15px',
  marginBottom: '36px',
}