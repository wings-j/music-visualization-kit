/**
 * Painter
 */
class Painter {
  private offscreenCanvas: OffscreenCanvas;
  private offscreenContext: OffscreenCanvasRenderingContext2D;
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  get wrap(): [number, number, number, number] {
    return [0, 0, this.width, this.height];
  }

  /**
   * Constructor
   * @param [element] Element or Selector
   * @param [width] Width of Canvas
   * @param [height] Height of Canvas
   */
  constructor(element: HTMLCanvasElement | string, { width, height }: { width?: number; height?: number } = {}) {
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

    this.width = width ?? this.element.clientWidth;
    this.height = height ?? this.element.clientHeight;
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

    draw(this.offscreenContext);

    this.context.clearRect(...this.wrap);
    this.context.drawImage(this.offscreenCanvas, ...this.wrap);
  }
}

export { Painter };
