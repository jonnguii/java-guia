/** Vibração curta onde o aparelho permite. Silenciosa em todo o resto. */
export function tap(pattern: number | number[] = 8) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    /* sem suporte */
  }
}
