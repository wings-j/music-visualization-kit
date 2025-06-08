/**
 * Painter
 */
class Painter {
  private trace?: number;
  private element: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private offscreenCanvas: OffscreenCanvas;
  private offscreenContext: OffscreenCanvasRenderingContext2D;
  width: number;
  height: number;

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
        throw new Error(`Audio Element not Found: ${element}.`);
      }
      this.element = el;
    } else {
      this.element = element;
    }
    this.context = this.element.getContext('2d')!;

    this.width = Number.parseInt(this.element.getAttribute('width') ?? '') || this.element.clientWidth;
    this.height = Number.parseInt(this.element.getAttribute('height') ?? '') || this.element.clientHeight;
    this.element.width = this.width;
    this.element.height = this.height;

    this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
    this.offscreenContext = this.offscreenCanvas.getContext('2d')!;
  }

  /**
   * Update
   * @param [draw] Drawing Function
   */
  update(draw: (brush: OffscreenCanvasRenderingContext2D) => void) {
    this.offscreenContext.clearRect(...this.wrap);

    if (this.trace) {
      this.offscreenContext.globalAlpha = this.trace;
      this.offscreenContext.drawImage(this.element, ...this.wrap);
      this.offscreenContext.globalAlpha = 1;
    }

    draw(this.offscreenContext);

    this.context.clearRect(...this.wrap);
    this.context.drawImage(this.offscreenCanvas, ...this.wrap);
  }
}

export { Painter };
