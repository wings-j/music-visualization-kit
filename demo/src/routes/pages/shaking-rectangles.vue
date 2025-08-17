<script setup lang="ts">
  import Chroma from 'chroma-js';
  import { mean } from 'mathjs';
  import { Animator, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    const transformer: Transformer = new Transformer($audio.value!);
    const painter: Painter = new Painter($canvas.value!, { center: true });
    const blue_0 = 'rgb(8, 8, 50)';
    const scale = Chroma.scale([blue_0, 'rgb(0, 0, 0)']).mode('rgb');
    const blue_1 = scale(0.3).hex();
    const blue_2 = scale(0.6).hex();
    const blue_3 = scale(0.9).hex();

    const animator = new Animator(() => {
      let data = transformer.get();
      let average = mean(...data);

      painter.update(brush => {
        const size = painter.width * 0.1 + painter.height * 0.2 * transformer.progress;
        const delta = painter.height * 0.3;

        let shakes: number[] = [];
        for (let i = 0; i < 8; i++) {
          shakes.push(data[Math.floor(data.length * 0.25 + (data.length / 16) * i)] + Math.random() * 0.02);
        }
        let points = [
          [-(size + delta * shakes[0]), -(size * 1.2 + delta * shakes[7])],
          [size + delta * shakes[5], -(size * 1.2 + delta * shakes[2])],
          [size + delta * shakes[3], size * 1.2 + delta * shakes[4]],
          [-(size + delta * shakes[6]), size * 1.2 + delta * shakes[1]]
        ];

        brush.context.beginPath();
        brush.context.moveTo(points[0][0], points[0][1]);
        brush.context.lineTo(points[1][0], points[1][1]);
        brush.context.lineTo(points[2][0], points[2][1]);
        brush.context.lineTo(points[3][0], points[3][1]);
        brush.context.closePath();

        brush.context.fillStyle = blue_0;
        brush.context.fill();

        /* Black Line */

        const random0 = () => (Math.random() - 0.5) * delta * 0.8 * average;

        brush.context.beginPath();
        brush.context.moveTo(points[0][0] + random0(), points[0][1] + random0());
        brush.context.lineTo(points[1][0] + random0(), points[1][1] + random0());
        brush.context.lineTo(points[2][0] + random0(), points[2][1] + random0());
        brush.context.lineTo(points[3][0] + random0(), points[3][1] + random0());
        brush.context.closePath();

        brush.context.strokeStyle = 'black';
        brush.context.lineWidth = 2;
        brush.context.stroke();

        /* White Line */

        const random1 = () => (Math.random() - 0.5) * delta * 0.8 * average;

        brush.context.beginPath();
        brush.context.moveTo(points[0][0] + random1(), points[0][1] + random1());
        brush.context.lineTo(points[1][0] + random1(), points[1][1] + random1());
        brush.context.lineTo(points[2][0] + random1(), points[2][1] + random1());
        brush.context.lineTo(points[3][0] + random1(), points[3][1] + random1());
        brush.context.closePath();

        brush.context.strokeStyle = 'white';
        brush.context.lineWidth = 2;
        brush.context.stroke();

        /* Rectangles */

        brush.context.beginPath();
        brush.context.moveTo(points[0][0], points[0][1]);
        brush.context.lineTo(points[1][0], points[1][1]);
        brush.context.lineTo(points[2][0], points[2][1]);
        brush.context.lineTo(points[3][0], points[3][1]);
        brush.context.closePath();
        brush.context.clip();

        const random2 = () => (Math.random() - 0.5) * delta * 0.6 * average;

        brush.context.beginPath();
        brush.context.moveTo(points[0][0] * 0.8 + random2(), points[0][1] * 0.8 + random2());
        brush.context.lineTo(points[1][0] * 0.8 + random2(), points[1][1] * 0.8 + random2());
        brush.context.lineTo(points[2][0] * 0.8 + random2(), points[2][1] * 0.8 + random2());
        brush.context.lineTo(points[3][0] * 0.8 + random2(), points[3][1] * 0.8 + random2());
        brush.context.closePath();

        brush.context.fillStyle = blue_1;
        brush.context.fill();

        const random3 = () => (Math.random() - 0.5) * delta * 0.4 * average;

        brush.context.beginPath();
        brush.context.moveTo(points[0][0] * 0.5 + random3(), points[0][1] * 0.5 + random3());
        brush.context.lineTo(points[1][0] * 0.5 + random3(), points[1][1] * 0.5 + random3());
        brush.context.lineTo(points[2][0] * 0.5 + random3(), points[2][1] * 0.5 + random3());
        brush.context.lineTo(points[3][0] * 0.5 + random3(), points[3][1] * 0.5 + random3());
        brush.context.closePath();

        brush.context.fillStyle = blue_2;
        brush.context.fill();

        const random4 = () => (Math.random() - 0.5) * delta * 0.2 * average;

        brush.context.beginPath();
        brush.context.moveTo(points[0][0] * 0.2 + random4(), points[0][1] * 0.2 + random4());
        brush.context.lineTo(points[1][0] * 0.2 + random4(), points[1][1] * 0.2 + random4());
        brush.context.lineTo(points[2][0] * 0.2 + random4(), points[2][1] * 0.2 + random4());
        brush.context.lineTo(points[3][0] * 0.2 + random4(), points[3][1] * 0.2 + random4());
        brush.context.closePath();

        brush.context.fillStyle = blue_3;
        brush.context.fill();
      });
    });

    $audio.value!.addEventListener('play', () => {
      animator.play();
    });
    $audio.value!.addEventListener('pause', () => {
      animator.pause();
    });
  });
</script>

<template>
  <canvas ref="$canvas" style="width: 100vw; height: 100vh"></canvas>
  <audio
    ref="$audio"
    style="position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%)"
    src="/music-visualization-resource/义礼.ogg"
    controls
    volume="0.5"
    preload="auto"
  ></audio>
</template>

<style scoped lang="scss"></style>
