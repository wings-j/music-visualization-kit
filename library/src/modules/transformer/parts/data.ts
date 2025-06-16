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
}

export { Data };
