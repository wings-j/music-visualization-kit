<script setup lang="ts">
  import { mean } from 'mathjs';
  import { Animator, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    const transformer: Transformer = new Transformer($audio.value!);
    const painter: Painter = new Painter($canvas.value!, { center: true });

    const animator = new Animator(() => {
      let data = transformer.get();
      let average = mean(...data);

      painter.update(brush => {
        /* Center Rectangle */
        {
          const size = painter.width * 0.1;
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

          brush.context.fillStyle = '#101036';
          brush.context.fill();

          const random = () => (Math.random() - 0.5) * delta * 0.8 * average;

          brush.context.beginPath();
          brush.context.moveTo(points[0][0] + random(), points[0][1] + random());
          brush.context.lineTo(points[1][0] + random(), points[1][1] + random());
          brush.context.lineTo(points[2][0] + random(), points[2][1] + random());
          brush.context.lineTo(points[3][0] + random(), points[3][1] + random());
          brush.context.closePath();

          brush.context.strokeStyle = '#05005E';
          brush.context.lineWidth = 2;
          brush.context.stroke();
        }
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
