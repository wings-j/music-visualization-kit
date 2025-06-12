import { Brush } from './parts/brush';

/**
 * Painter
 */
class Painter {
  private readonly trace?: number;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly offscreenCanvas: OffscreenCanvas;
  private readonly offscreenContext: OffscreenCanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
  readonly brush: Brush;

  private get wrap(): [number, number, number, number] {
    return [0, 0, this.width, this.height];
  }

  /**
   * Constructor
   * @param [element] Element or Selector
   * @param [trace] Trace
   */
  constructor(element: HTMLCanvasElement | string, { trace }: { trace?: number } = {}) {
    this.trace = trace;

    if (typeof element === 'string') {
      let el = window.document.querySelector<HTMLCanvasElement>(element);
      if (!el) {
        throw new Error(`Canvas Element not Found: ${element}.`);
      }
      this.canvas = el;
    } else {
      this.canvas = element;
    }
    this.context = this.canvas.getContext('2d')!;

    this.width = Number.parseInt(this.canvas.getAttribute('width') ?? '') || this.canvas.clientWidth;
    this.height = Number.parseInt(this.canvas.getAttribute('height') ?? '') || this.canvas.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
    this.offscreenContext = this.offscreenCanvas.getContext('2d')!;
    this.brush = new Brush(this.canvas, this.offscreenContext);
  }

  /**
   * Update
   * @param [draw] Drawing Function
   */
  update(draw: (brush: Brush) => void) {
    this.offscreenContext.clearRect(...this.wrap);

    if (this.trace) {
      this.offscreenContext.globalAlpha = this.trace;
      this.offscreenContext.drawImage(this.canvas, ...this.wrap);
      this.offscreenContext.globalAlpha = 1;
    }

    draw(this.brush);

    this.context.clearRect(...this.wrap);
    this.context.drawImage(this.offscreenCanvas, ...this.wrap);
  }
}

export { Painter };
