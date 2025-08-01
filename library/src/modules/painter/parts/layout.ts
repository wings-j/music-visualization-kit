import { Point } from '../types/point';

/**
 * Layout
 */
class Layout {
  /**
   * Linear
   * @param [data] Data
   * @param [width] Width
   * @param [height] Height
   * @param [startX] Start X
   * @param [startY] Start Y
   * @return Points
   */
  static linear(data: number[], width: number, height: number, { startX = 0, startY = 0 }: { startX?: number; startY?: number } = {}) {
    let temp: Point[] = [];

    let deltaWidth = Math.ceil(width / data.length);
    for (let i = 0; i < data.length; i++) {
      let x = startX + i * deltaWidth;
      let y = startY + data[i] * height;

      temp.push(new Point(x, y));
    }

    return temp;
  }
  /**
   * Circular
   * @param [data] Data
   * @param [radius] Radius
   * @param [amplitude] Amplitude
   * @param [centerX] Center X
   * @param [centerY] Center Y
   * @return Points
   */
  static circular(data: number[], radius: number, amplitude: number, { centerX = 0, centerY = 0 }: { centerX?: number; centerY?: number } = {}) {
    let temp: Point[] = [];

    let deltaAngle = (2 * Math.PI) / data.length;
    for (let i = 0; i < data.length; i++) {
      let angle = i * deltaAngle;
      let x = centerX + (radius + (data[i] - 0.5) * amplitude) * Math.cos(angle);
      let y = centerY + (radius + (data[i] - 0.5) * amplitude) * Math.sin(angle);

      temp.push(new Point(x, y));
    }

    return temp;
  }
}

export { Layout };
