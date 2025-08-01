/**
 * Animator
 */
class Animator {
  private readonly callback: (time: number) => void;
  private readonly duration: number;
  private lastTime = 0;
  private frameTime = 0;
  private timer: number = 0;
  state: 'stop' | 'play' | 'pause' = 'stop';
  accumulateTime = 0;

  /**
   * Constructor
   * @param [callback] Callback
   * @param [rate] Frame Rate
   */
  constructor(callback: (time: number) => void, { rate = 60 }: { rate?: number } = {}) {
    this.callback = callback;
    this.duration = Math.floor(1000 / rate);
  }

  /**
   * Run
   */
  private run() {
    if (this.state === 'play') {
      this.timer = window.requestAnimationFrame(time => {
        if (this.lastTime !== 0) {
          let delta = time - this.lastTime;
          this.accumulateTime += delta;
          this.frameTime += delta;

          if (this.frameTime >= this.duration) {
            this.frameTime %= this.duration;

            this.callback(delta);
          }
        }

        this.lastTime = time;
        this.run();
      });
    }
  }

  /**
   * Play
   */
  play() {
    this.state = 'play';
    this.run();
  }
  /**
   * Pause
   */
  pause() {
    this.state = 'pause';
    window.cancelAnimationFrame(this.timer);
  }
  /**
   * Stop
   */
  stop() {
    this.state = 'stop';
    window.cancelAnimationFrame(this.timer);

    this.accumulateTime = 0;
    this.frameTime = 0;
    this.lastTime = 0;
  }
}

export { Animator };
