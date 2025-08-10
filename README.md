Web music visualization animation kits.

TypeScript and JavaScript(ESNext) library.

Demos: [https://wings-j.github.io/music-visualization-kit](https://wings-j.github.io/music-visualization-kit).

# Installation

```sh
npm install music-visualization-kit
```

# Usage

Basic example:

```ts
import { Animator, Painter, Transformer } from 'music-visualization-kit';
import { interpolateColor } from '../utils/interpolate-color';

let transformer: Transformer = new Transformer($audio); // $audio is HTMLAudioElement
let painter: Painter = new Painter($canvas); // $canvas is HTMLCanvasElement
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

      brush.context.fillStyle = interpolateColor(data[i]);
      brush.context.fillRect(x, y, w, h);
    }
  });
});

animator.play();
$audio.play();
```

# API

## Transformer

Transform audio to frequency or time domain data.

### Constructor

```ts
constructor(element: HTMLAudioElement | string, options: { size?: number; nodes?: AudioNode[] } = {})
```

- @param [element] Element or Selector
- @param [size] Size of Audio Buffer. Half of FFT Size. Default is 256
- @param [nodes] Additional Audio Nodes to connect

### Properties

#### size

Data length and FFT half size.

```ts
size: number;
```

### Methods

#### get

Get normalized data.

```ts
get(time = false): number[]
```

- @description Normalized Data.
- @param [time] Time Domain. The default is frequency domain.
- @return Data

#### dispose

Dispose the audio context.

```ts
dispose(): void
```

## Painter

Render canvas.

### Constructor

```ts
constructor(element: HTMLCanvasElement | string, options: { center?: boolean, trace?: number } = {})
```

- @param [element] Element or Selector
- @param [center] Translate Origin to the Center of the Screen
- @param [trace] Trace of the Last Frame

### Properties

#### canvas

Canvas element.

```ts
canvas: HTMLCanvasElement;
```

#### context

Canvas context.

```ts
context: CanvasRenderingContext2D;
```

#### offscreenCanvas

Canvas element.

```ts
offscreenCanvas: OffscreenCanvas;
```

#### offscreenContext

Canvas context.

```ts
offscreenContext: OffscreenCanvasRenderingContext2D;
```

#### width

Canvas width.

```ts
width: number;
```

#### height

Canvas height.

```ts
height: number;
```

### Methods

#### update

Update trigger.

```ts
update(draw: (brush: Brush) => void)
```

- @param [draw] Drawing Function

## Animator

Animation trigger by `requestAnimationFrame`.

### Constructor

```ts
constructor(callback: (time: number) => void, options: { rate?: number } = {})
```

- @param [callback] Callback
- @param [rate] Frame Rate. Default is 60

### Properties

#### state

Playing state.

```ts
state: 'stop' | 'play' | 'pause';
```

#### accumulateTime

Accumulated time since played.

```
accumulated: number
```

### Methods

#### play

Play.

```ts
play();
```

#### pause

Pause.

```ts
pause();
```

#### stop

Stop.

```ts
stop();
```

## Data

Tool class to processing data.

### Methods

#### jitter

Add random noise to data.

```ts
static jitter(data: number[], amplitude: number) => number[]
```

- @param [data] Data
- @param [amplitude] Amplitude
- @return Jittered data

#### extract

Extract data with specific interval.

```ts
static extract(data: number[], interval: number) => number[]
```

- @param [data] Data
- @param [interval] Interval
- @return Extracted data

## Layout

Tool class to transform data to points.

### Methods

#### linear

Position points by a fixed gap of x axis and the data value as the y values.

```ts
static linear(data: number[], width: number, height: number, options: { startX?: number; startY?: number } = {}): Point[]
```

- @param [data] Data
- @param [width] Width
- @param [height] Height
- @param [startX] Start X
- @param [startY] Start Y
- @return Points

#### circular

Position points around a center point.

```ts
static circular(data: number[], radius: number, amplitude: number, { centerX = 0, centerY = 0 }: { centerX?: number; centerY?: number } = {}): Point[]
```

- @param [data] Data
- @param [radius] Radius
- @param [amplitude] Amplitude
- @param [centerX] Center X
- @param [centerY] Center Y
- @return Points
