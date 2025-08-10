/**
 * Data
 */
class Data {
  /**
   * Jitter
   * @param [data] Data
   * @param [amplitude] Amplitude
   * @return Jittered data
   */
  static jitter(data: number[], amplitude: number) {
    return data.map(value => {
      return value + (Math.random() * 2 - 1) * amplitude;
    });
  }
  /**
   * Extract
   * @param [data] Data
   * @param [interval] Interval
   * @return Extracted data
   */
  static extract(data: number[], interval: number) {
    let length = data.length;
    let current = 0;
    let temp: number[] = [];
    while (current <= length) {
      temp.push(data[current]);
      current += interval;
    }

    return temp;
  }
}

export { Data };
