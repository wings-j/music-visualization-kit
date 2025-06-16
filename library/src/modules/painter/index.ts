import { Point } from './types/point';

/**
 * Painter
 */
class Painter {
  private readonly trace?: number;
  private readonly center: boolean;
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly offscreenCanvas: OffscreenCanvas;
  readonly offscreenContext: OffscreenCanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
  readonly brush: Brush;

  private get wrap(): [number, number, number, number] {
    return [0, 0, this.width, this.height];
  }
  private get offscreenWrap(): [number, number, number, number] {
    if (this.center) {
      return [-this.width / 2, -this.height / 2, this.width, this.height];
    } else {
      return [0, 0, this.width, this.height];
    }
  }

  /**
   * Constructor
   * @param [element] Element or Selector
   * @param [trace] Trace
   */
  constructor(element: HTMLCanvasElement | string, { center = false, trace }: { center?: boolean; trace?: number } = {}) {
    this.trace = trace;
    this.center = center;

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
    this.setTransform();

    this.brush = new Brush(this.canvas, this.offscreenContext);
  }

  /**
   * Set Transform
   */
  private setTransform() {
    this.offscreenContext.scale(1, -1);
    if (this.center) {
      this.offscreenContext.translate(this.width / 2, -this.height / 2);
    } else {
      this.offscreenContext.translate(0, -this.height);
    }
  }
  /**
   * Clear Transform
   */
  private clearTransform() {
    // this.offscreenContext.setTransform(1, 0, 0, 1, 0, 0);
    if (this.center) {
      this.offscreenContext.translate(-this.width / 2, this.height / 2);
    } else {
      this.offscreenContext.translate(0, this.height);
    }
    this.offscreenContext.scale(1, -1);
  }
  /**
   * Update
   * @param [draw] Drawing Function
   */
  update(draw: (brush: Brush) => void) {
    this.offscreenContext.clearRect(...this.offscreenWrap);

    if (this.trace && this.trace < 1) {
      this.clearTransform();
      this.offscreenContext.globalAlpha = this.trace;
      this.offscreenContext.drawImage(this.canvas, ...this.wrap); // Because the transform is restored, so the `wrap` should be used instead of `offscreenWrap`.
      this.setTransform();
      this.offscreenContext.globalAlpha = 1;
    }

    this.offscreenContext.save();
    draw(this.brush);
    this.offscreenContext.restore();

    this.context.clearRect(...this.wrap);
    this.context.drawImage(this.offscreenCanvas, ...this.wrap);
  }
}

/**
 * Brush
 */
class Brush {
  readonly canvas: HTMLCanvasElement;
  readonly context: OffscreenCanvasRenderingContext2D;

  /**
   * Constructor
   * @param [canvas] Canvas
   * @param [context] Context
   */
  constructor(canvas: HTMLCanvasElement, context: OffscreenCanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  /**
   * Draw Curve
   * @param [points] Points
   * @param [tension1] Tension for First Control Point
   * @param [tension2] Tension for Second Control Point
   * @param [closed] Closed
   */
  drawCurve(points: Point[], { tension1 = 0.15, tension2 = 0.15, closed = false }: { tension1?: number; tension2?: number; closed?: boolean } = {}) {
    if (points.length >= 2) {
      const calculateControlPoints = (subPoints: [Point, Point, Point, Point]) => {
        let p1x = subPoints[1]!.x + (subPoints[2]!.x - subPoints[0]!.x) * tension1;
        let p1y = subPoints[1]!.y + (subPoints[2]!.y - subPoints[0]!.y) * tension1;
        let p2x = subPoints[2]!.x - (subPoints[3]!.x - subPoints[1]!.x) * tension2;
        let p2y = subPoints[2]!.y - (subPoints[3]!.y - subPoints[1]!.y) * tension2;

        return { p1x, p1y, p2x, p2y };
      };

      this.context.beginPath();

      if (closed) {
        this.context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          let { p1x, p1y, p2x, p2y } = calculateControlPoints([points.at(i - 2)!, points.at(i - 1)!, points.at(i)!, points.at((i + 1) % points.length)!]);
          this.context.bezierCurveTo(p1x, p1y, p2x, p2y, points.at(i)!.x, points.at(i)!.y);
        }
        let i = 0;
        let { p1x, p1y, p2x, p2y } = calculateControlPoints([points.at(i - 2)!, points.at(i - 1)!, points.at(i)!, points.at((i + 1) % points.length)!]);
        this.context.bezierCurveTo(p1x, p1y, p2x, p2y, points.at(i)!.x, points.at(i)!.y);

        this.context.closePath();
      } else {
        points = [points[0], ...points, points[points.length - 1]];

        this.context.moveTo(points[0].x, points[0].y);
        for (let i = 2; i < points.length - 1; i++) {
          let { p1x, p1y, p2x, p2y } = calculateControlPoints([points[i - 2], points[i - 1], points[i], points[i + 1]]);

          this.context.bezierCurveTo(p1x, p1y, p2x, p2y, points[i].x, points[i].y);
        }
      }

      this.context.stroke();
    }
  }
}

export { Brush, Painter };
