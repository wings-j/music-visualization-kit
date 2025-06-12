/**
 * Brush
 */
class Brush {
  readonly canvas: HTMLCanvasElement;
  readonly context: OffscreenCanvasRenderingContext2D;

  /**
   * Constructor
   * @param [canvas] HTMLCanvasElement
   * @param [context] OffscreenCanvasRenderingContext2D
   */
  constructor(canvas: HTMLCanvasElement, context: OffscreenCanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }
}

export { Brush };
