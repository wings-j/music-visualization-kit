/**
 * Interpolate Color
 * @param [value] Value. 0~1
 * @return Color
 */
function interpolateColor(value: number) {
  const blue = { r: 0, g: 47, b: 167 };
  const magenta = { r: 255, g: 0, b: 255 };

  value = Math.max(0, Math.min(1, value));
  let r = Math.round(blue.r + (magenta.r - blue.r) * value);
  let g = Math.round(blue.g + (magenta.g - blue.g) * value);
  let b = Math.round(blue.b + (magenta.b - blue.b) * value);

  return `rgb(${r}, ${g}, ${b})`;
}

export { interpolateColor };
