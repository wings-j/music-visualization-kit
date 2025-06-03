/**
 * Animator
 */
class Animator {
  private callback: (time: number) => void;
  private duration: number;
  private currentTime = 0;
  private accumulateTime = 0;
  private lastTime = 0;
  private timer: number = 0;
  state: State = State.stop;

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
    if (this.state === State.play) {
      this.timer = window.requestAnimationFrame(time => {
        if (this.lastTime !== 0) {
          let delta = time - this.lastTime;
          this.currentTime += delta;
          this.accumulateTime += delta;

          if (this.accumulateTime >= this.duration) {
            this.accumulateTime %= this.duration;

            this.callback(this.currentTime);
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
    this.state = State.play;
    this.run();
  }
  /**
   * Pause
   */
  pause() {
    this.state = State.pause;
    window.cancelAnimationFrame(this.timer);
  }
  /**
   * Stop
   */
  stop() {
    this.state = State.stop;
    window.cancelAnimationFrame(this.timer);

    this.currentTime = 0;
    this.accumulateTime = 0;
    this.lastTime = 0;
  }
}

/**
 * State
 */
enum State {
  stop,
  play,
  pause
}

export { Animator };
