/**
 * Reads CSS custom property values from the document root for canvas rendering.
 * Canvas elements can't use CSS variables directly, so this utility bridges the gap.
 *
 * Call `getCanvasTheme()` before each render and on theme changes.
 */
export interface CanvasTheme {
  /** Primary text/line color (axes, labels) */
  textColor: string;
  /** Secondary/muted text (grid labels, hints) */
  textMuted: string;
  /** Canvas background fill */
  background: string;
  /** Surface color (card backgrounds within canvas) */
  surface: string;
  /** Grid line color */
  gridLine: string;
  /** Border/axis line color */
  borderColor: string;
  /** Success feedback color */
  success: string;
  /** Danger/error feedback color */
  danger: string;
  /** Primary accent color */
  primary: string;
}

export function getCanvasTheme(): CanvasTheme {
  const styles = getComputedStyle(document.documentElement);
  const get = (prop: string, fallback: string): string =>
    styles.getPropertyValue(prop).trim() || fallback;

  return {
    textColor:   get('--text-heading', '#24292d'),
    textMuted:   get('--text-body', '#747579'),
    background:  get('--bg-body', '#ffffff'),
    surface:     get('--bg-surface', '#ffffff'),
    gridLine:    get('--border-color', '#eff1f2'),
    borderColor: get('--gray-400', '#cfd3d7'),
    success:     get('--color-success', '#0cbc87'),
    danger:      get('--color-danger', '#d6293e'),
    primary:     get('--color-primary', '#066ac9'),
  };
}
