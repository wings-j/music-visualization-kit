# music-visualization-kit

Web music visualization animation kits.

TypeScript and JavaScript(ESNext) library.

## Installation

```sh
npm install music-visualization-kit
```

## Usage

Basic example:

```ts
import { Animator, Painter, Transformer } from 'music-visualization-kit';
import { interpolateColor } from '../utils/interpolate-color';

let transformer: Transformer = new Transformer($audio);
let painter: Painter = new Painter($canvas);
let animator = new Animator(() => {
  let data = transformer.get();
  painter.update(brush => {
    let length = data.length;
    let width = Math.ceil(painter.width / length);
    for (let i = 0; i < length; i++) {
      let x = Math.floor(i * width);
      let y = painter.height;
      let w = width - 1;
      let h = -Math.floor(data[i] * painter.height);

      brush.fillStyle = interpolateColor(data[i]);
      brush.fillRect(x, y, w, h);
    }
  });
});

animator.play();
```

## API

### Transformer

Transform audio to frequency or time domain data.

#### Constructor

```ts
/**
 * Constructor
 * @param [element] Element or Selector
 * @param [size] Size of Audio Buffer. Half of FFT Size
 * @param [nodes] Additional Audio Nodes to connect
 */
constructor(element: HTMLAudioElement | string, { size = 256, nodes = [] }: { size?: number; nodes?: AudioNode[] } = {})
```

#### Methods

##### dispose

Dispose the audio context.

```ts
/**
 * Dispose
 */
dispose(): void
```

##### get

Get normalized data.

```ts
/**
 * Get
 * @description Normalized Data.
 * @param [time] Time Domain. The default is frequency domain.
 * @return Data
 */
get(time = false): number[]
```

### Painter

Render canvas.

#### Constructor

```ts
/**
 * Constructor
 * @param [element] Element or Selector
 * @param [trace] Trace of the Last Frame
 */
constructor(element: HTMLCanvasElement | string, { trace }: { trace?: number } = {})
```

### Animator

Animation trigger by `requestAnimationFrame`.

#### Constructor

```ts
/**
 * Constructor
 * @param [callback] Callback
 * @param [rate] Frame Rate
 */
constructor(callback: (time: number) => void, { rate = 60 }: { rate?: number } = {})
```

#### Properties

##### state

Playing state.

```ts
state: 'stop' | 'play' | 'pause';
```

##### accumulateTime

Accumulated time since played.

```
accumulated: number
```

#### Methods

##### play

Play.

```ts
/**
 * Play
 */
play();
```

##### pause

Pause.

```ts
/**
 * Pause
 */
pause();
```

##### stop

Stop.

```ts
/**
 * Stop
 */
stop();
```
