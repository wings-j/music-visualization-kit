<script setup lang="ts">
  import { Animator, Painter, Point, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    let transformer: Transformer = new Transformer($audio.value!);
    let painter: Painter = new Painter($canvas.value!);
    let radius = Math.min(painter.width, painter.height) * 0.5;

    let animator = new Animator(() => {
      let data = transformer.get();
      painter.update(brush => {
        let length = data.length;
        let deltaWidth = Math.ceil(painter.width / length);

        let points: Point[] = [];
        for (let i = 0; i < length; i++) {
          points.push(new Point(deltaWidth * i, painter.height * data[i]));
        }

        brush.drawCurve(points);
      });
    });

    animator.play();
  });
</script>

<template>
  <canvas ref="$canvas" style="width: 100vw; height: 100vh"></canvas>
  <audio
    ref="$audio"
    style="position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%)"
    src="/music-visualization-resource/Cathy.ogg"
    controls
    volume="0.5"
    preload="auto"
  ></audio>
</template>

<style scoped></style>
