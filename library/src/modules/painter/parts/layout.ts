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
}

export { Layout };
