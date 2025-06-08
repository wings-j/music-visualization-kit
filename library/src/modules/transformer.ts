const max = 256; // 2**8

/**
 * Transformer
 */
class Transformer {
  private size: number;
  private nodes: AudioNode[]; // Nodes in Between
  private element: HTMLAudioElement;
  private context: AudioContext;
  private source: MediaElementAudioSourceNode; // Node First
  private analyser: AnalyserNode; // Node Last

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

    if (typeof element === 'string') {
      let el = window.document.querySelector<HTMLAudioElement>(element);
      if (!el) {
        throw new Error(`Audio Element not Found: ${element}.`);
      }
      this.element = el;
    } else {
      this.element = element;
    }
    this.element.addEventListener('play', this.handleAudioPlay);
    this.element.addEventListener('pause', this.handleAudioPause);

    this.context = new AudioContext();
    this.source = this.context.createMediaElementSource(this.element);
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
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  };
  /**
   * Handle Audio Pause
   */
  private handleAudioPause = () => {
    if (this.context.state === 'running') {
      this.context.suspend();
    }
  };
  /**
   * Dispose
   */
  dispose(): void {
    this.source.disconnect();
    this.context.close();

    this.element.removeEventListener('play', this.handleAudioPlay);
    this.element.removeEventListener('pause', this.handleAudioPause);
  }
  /**
   * Get
   * @description Normalized Data.
   * @param [time] Time Domain
   * @return Data
   */
  get(time = false): number[] {
    let buffer = new Uint8Array(this.analyser.fftSize);
    if (time) {
      this.analyser.getByteTimeDomainData(buffer);
    } else {
      this.analyser.getByteFrequencyData(buffer);
    }
    let array = Array.from(buffer)
      .slice(0, Math.floor(buffer.length / 2))
      .map(a => a / max);

    return array;
  }
}

export { Transformer };
