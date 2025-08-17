const max = 256; // 2**8

/**
 * Transformer
 */
class Transformer {
  private readonly nodes: AudioNode[]; // Nodes in Between
  private readonly audio: HTMLAudioElement;
  private readonly context: AudioContext;
  private readonly source: MediaElementAudioSourceNode; // Node First
  private readonly analyser: AnalyserNode; // Node Last
  private readonly buffer: Uint8Array<ArrayBuffer>;
  readonly size: number;

  get current() {
    return this.audio.currentTime;
  }
  get duration() {
    return this.audio.duration;
  }
  get progress() {
    return this.current / this.duration;
  }

  /**
   * Constructor
   * @param [element] Element or Selector
   * @param [size] Size of Audio Buffer. Half of FFT Size
   * @param [nodes] Additional Audio Nodes to connect
   */
  constructor(element: HTMLAudioElement | string, { size = 256, nodes = [] }: { size?: number; nodes?: AudioNode[] } = {}) {
    if (Math.log2(size) !== Math.floor(Math.log2(size)) || size < 1) {
      throw new Error(`Invalid Size: ${size}. Must be a power of 2 greater than 0.`);
    }

    this.size = size;
    this.nodes = nodes;
    this.buffer = new Uint8Array(this.size * 2);

    if (typeof element === 'string') {
      let el = window.document.querySelector<HTMLAudioElement>(element);
      if (!el) {
        throw new Error(`Audio Element not Found: ${element}.`);
      }
      this.audio = el;
    } else {
      this.audio = element;
    }
    this.audio.addEventListener('play', this.handleAudioPlay);
    this.audio.addEventListener('pause', this.handleAudioPause);

    this.context = new AudioContext();
    this.source = this.context.createMediaElementSource(this.audio);
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = this.size * 2;
    let current = this.source as AudioNode;
    for (let a of this.nodes) {
      current.connect(a);
      current = a;
    }
    current.connect(this.context.destination);
    current.connect(this.analyser);
  }

  /**
   * Handle Audio Play
   */
  private handleAudioPlay = () => {
    this.context.resume();
  };
  /**
   * Handle Audio Pause
   */
  private handleAudioPause = () => {
    this.context.suspend();
  };
  /**
   * Get
   * @description Normalized Data.
   * @param [time] Time Domain
   * @return Data
   */
  get(time = false) {
    if (time) {
      this.analyser.getByteTimeDomainData(this.buffer);
    } else {
      this.analyser.getByteFrequencyData(this.buffer);
    }
    let array = Array.from(this.buffer)
      .slice(0, Math.floor(this.buffer.length / 2))
      .map(a => a / max);

    return array;
  }
  /**
   * Dispose
   */
  dispose() {
    this.source.disconnect();
    this.context.close();

    this.audio.removeEventListener('play', this.handleAudioPlay);
    this.audio.removeEventListener('pause', this.handleAudioPause);
  }
}

export { Transformer };
