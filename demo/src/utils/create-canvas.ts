/**
 * Create Canvas
 * @return Canvas
 */
function createCanvas() {
  let existed = window.document.querySelector('canvas');
  if (existed) {
    window.document.body.removeChild(existed);
  }

  let canvas = window.document.createElement('canvas');
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  window.document.body.appendChild(canvas);

  return canvas;
}

export { createCanvas };
