/**
 * FlowSync Design Tokens
 * Notion-inspired design system for consistent UI/UX
 *
 * @description
 * This file defines the core design tokens used throughout FlowSync.
 * Based on Notion's minimalist design philosophy with a focus on
 * reducing cognitive load and providing clear information hierarchy.
 */

// ============================================================================
// Color Palette - Notion Inspired
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#2F3437',
    50: '#F7F7F7',
    100: '#E8E8E8',
    200: '#D1D1D1',
    300: '#A3A3A3',
    400: '#787774',
    500: '#5C5C5A',
    600: '#454544',
    700: '#2F3437',
    800: '#1F2124',
    900: '#121416',
  },

  // Accent - Notion Blue
  accent: {
    DEFAULT: '#2383E2',
    50: '#EBF5FF',
    100: '#D6EBFF',
    200: '#ADD6FF',
    300: '#85C1FF',
    400: '#5CACFF',
    500: '#2383E2',
    600: '#1B6BB8',
    700: '#14528E',
    800: '#0D3A64',
    900: '#06213A',
  },

  // Semantic Colors
  success: {
    DEFAULT: '#0F7B6C',
    50: '#ECFDF8',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#0F7B6C',
    600: '#0C6358',
    700: '#094B44',
    800: '#063330',
    900: '#031B1C',
  },

  warning: {
    DEFAULT: '#D9730D',
    50: '#FFF8F1',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#D9730D',
    600: '#B45C0A',
    700: '#8F4608',
    800: '#6A3005',
    900: '#451A03',
  },

  error: {
    DEFAULT: '#E03E3E',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#E03E3E',
    600: '#B83232',
    700: '#912626',
    800: '#6A1A1A',
    900: '#430E0E',
  },

  // Neutral - Surface Colors
  surface: {
    DEFAULT: '#F7F6F3',
    white: '#FFFFFF',
    light: '#FBFBFA',
    muted: '#F7F6F3',
    subtle: '#EFEEED',
    border: '#E5E4E0',
    divider: '#D3D2CE',
  },

  // Text Colors
  text: {
    primary: '#37352F',
    secondary: '#787774',
    tertiary: '#9B9A97',
    disabled: '#CFCECA',
    inverse: '#FFFFFF',
  },
} as const;

// ============================================================================
// Typography
// ============================================================================

export const typography = {
  fontFamily: {
    sans: [
      'ui-sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(', '),
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'SF Mono',
      'Menlo',
      'Monaco',
      'Consolas',
      'monospace',
    ].join(', '),
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// ============================================================================
// Spacing
// ============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// Shadows
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  // Drag and Drop specific shadows
  drag: {
    idle: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    lifting: '0 8px 16px -2px rgb(0 0 0 / 0.15), 0 4px 8px -2px rgb(0 0 0 / 0.1)',
    dragging: '0 12px 24px -4px rgb(0 0 0 / 0.18), 0 6px 12px -2px rgb(0 0 0 / 0.12)',
  },

  // Focus ring shadow
  ring: '0 0 0 2px var(--ring-color, #2383E2)',
} as const;

// ============================================================================
// Animation & Transitions
// ============================================================================

export const animation = {
  // Timing functions (easing)
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Spring-like easing for organic feel
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Smooth bounce
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Duration (in milliseconds)
  duration: {
    instant: 50,
    fast: 100,
    normal: 150,
    moderate: 200,
    slow: 300,
    slower: 400,
    slowest: 500,
  },

  // Predefined transitions
  transition: {
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// Z-Index Scale
// ============================================================================

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',      // Base elements
  20: '20',      // Dropdowns, tooltips
  30: '30',      // Fixed elements
  40: '40',      // Modals backdrop
  50: '50',      // Modals
  60: '60',      // Popovers
  70: '70',      // Drag overlay
  80: '80',      // Toast notifications
  90: '90',      // Maximum priority
  100: '100',    // Debug/Dev tools
} as const;

// ============================================================================
// Due Date Status Configuration
// ============================================================================

export const dueDateStatus = {
  overdue: {
    label: 'Overdue',
    labelKo: '지남',
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
    icon: 'text-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
  },
  urgent: {
    label: 'Today',
    labelKo: '오늘',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-700',
    icon: 'text-orange-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  soon: {
    label: 'Soon',
    labelKo: '임박',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
    icon: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  normal: {
    label: 'Normal',
    labelKo: '여유',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-600 border-blue-200',
  },
  plenty: {
    label: 'Plenty',
    labelKo: '충분',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-600',
    icon: 'text-gray-500',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  none: {
    label: 'No date',
    labelKo: '미정',
    bg: 'bg-transparent',
    border: 'border-gray-200',
    text: 'text-gray-500',
    icon: 'text-gray-400',
    badge: 'bg-gray-50 text-gray-500 border-gray-200',
  },
} as const;

// ============================================================================
// Priority Configuration
// ============================================================================

export const priorityConfig = {
  Urgent: {
    label: 'Urgent',
    labelKo: '긴급',
    color: 'red',
    bg: 'bg-red-500',
    bgLight: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-300',
    badge: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    icon: 'AlertCircle',
  },
  High: {
    label: 'High',
    labelKo: '높음',
    color: 'orange',
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-300',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    icon: 'ArrowUp',
  },
  Medium: {
    label: 'Medium',
    labelKo: '보통',
    color: 'yellow',
    bg: 'bg-yellow-500',
    bgLight: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
    icon: 'Minus',
  },
  Low: {
    label: 'Low',
    labelKo: '낮음',
    color: 'blue',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-600 border-blue-200',
    dot: 'bg-blue-500',
    icon: 'ArrowDown',
  },
  None: {
    label: 'None',
    labelKo: '없음',
    color: 'gray',
    bg: 'bg-gray-400',
    bgLight: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-400',
    icon: 'Circle',
  },
} as const;

// ============================================================================
// Component Styles (Notion-style)
// ============================================================================

export const componentStyles = {
  // Card styles
  card: {
    base: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    hover: 'hover:shadow-md hover:border-gray-300',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    active: 'active:scale-[0.98]',
    padding: {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    },
  },

  // Button styles
  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150',
    sizes: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-base',
    },
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    },
  },

  // Input styles
  input: {
    base: 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 transition-colors duration-150',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    disabled: 'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
  },

  // Badge styles
  badge: {
    base: 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border',
    sizes: {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    },
  },
} as const;

// ============================================================================
// Drag and Drop Styles
// ============================================================================

export const dragAndDropStyles = {
  // Draggable item states
  draggable: {
    idle: {
      scale: 'scale-100',
      shadow: 'shadow-sm',
      opacity: 'opacity-100',
      cursor: 'cursor-grab',
    },
    hover: {
      scale: 'scale-100',
      shadow: 'shadow-md',
      border: 'border-blue-300',
      cursor: 'cursor-grab',
    },
    lifting: {
      scale: 'scale-[1.02]',
      shadow: 'shadow-lg',
      opacity: 'opacity-95',
      rotate: 'rotate-[1deg]',
    },
    dragging: {
      scale: 'scale-[1.03]',
      shadow: 'shadow-xl',
      opacity: 'opacity-90',
      cursor: 'cursor-grabbing',
      zIndex: 'z-50',
    },
  },

  // Placeholder (ghost element)
  placeholder: {
    base: 'border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-lg',
    active: 'border-blue-400 bg-blue-50/50',
  },

  // Drop zone states
  dropZone: {
    idle: 'bg-transparent',
    over: 'bg-blue-50/30 border-2 border-dashed border-blue-300',
    active: 'ring-2 ring-blue-400 ring-offset-2',
    invalid: 'bg-red-50/30 border-2 border-dashed border-red-300',
  },

  // Animation durations for drag states
  animation: {
    lift: 'duration-150',
    drop: 'duration-200',
    return: 'duration-300',
  },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type DueDateStatusKey = keyof typeof dueDateStatus;
export type PriorityKey = keyof typeof priorityConfig;
export type DueDateStatusConfig = typeof dueDateStatus[DueDateStatusKey];
export type PriorityConfig = typeof priorityConfig[PriorityKey];
