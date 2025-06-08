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
import { createAudio } from '../utils/create-audio';
import { createCanvas } from '../utils/create-canvas';
import { interpolateColor } from '../utils/interpolate-color';

let transformer: Transformer = new Transformer(createAudio());
let painter: Painter = new Painter(createCanvas());
let animator = new Animator(() => {
  let data = transformer.get();
  painter.update(brush => {
    let length = data.length;
    let width = painter.width / length;
    for (let i = 0; i < length; i++) {
      let x = Math.floor(i * width);
      let y = painter.height;
      let w = Math.ceil(painter.width / length) - 1;
      let h = -Math.floor(data[i] * painter.height);

      brush.fillStyle = interpolateColor(data[i]);
      brush.fillRect(x, y, w, h);
    }
  });
});

animator.play();
```
