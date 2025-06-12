import { Point } from '../types/point';

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
      points = [points[0], ...points, points[points.length - 1]]; // Duplicate first and last point for tension calculation.
      // TODO closed

      this.context.beginPath();
      this.context.moveTo(points[0].x, points[0].y);
      for (let i = 2; i < points.length - 1; i++) {
        let p1x = points[i - 1].x + (points[i].x - points[i - 2].x) * tension1;
        let p1y = points[i - 1].y + (points[i].y - points[i - 2].y) * tension1;
        let p2x = points[i].x - (points[i + 1].x - points[i - 1].x) * tension2;
        let p2y = points[i].y - (points[i + 1].y - points[i - 1].y) * tension2;

        this.context.bezierCurveTo(p1x, p1y, p2x, p2y, points[i].x, points[i].y);
      }
      this.context.stroke();
    }
  }
}

export { Brush };
