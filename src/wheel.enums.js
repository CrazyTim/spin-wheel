/**
 * Adjustment when drawing canvas arcs, because it draws from 90° instead of 0°.
 */
export const arcAdjust = -90;

export const fontScale = 500; // 500 seemed to be a good base value for this.

/**
 * Text alignment
 */
export const AlignText = Object.freeze({
  left: 'left',
  right: 'right',
  center: 'center',
});
