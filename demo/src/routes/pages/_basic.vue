<script setup lang="ts">
  import { Animator, Layout, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';
  import { interpolateColor } from '../../utils/interpolate-color';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    const transformer: Transformer = new Transformer($audio.value!);
    const painter: Painter = new Painter($canvas.value!);
    const animator = new Animator(() => {
      let data = transformer.get();
      let points = Layout.linear(data, painter.width, painter.height);

      painter.update(brush => {
        let deltaWidth = Math.ceil(painter.width / data.length);
        for (let i = 0; i < data.length; i++) {
          let { x, y } = points[i];

          brush.context.fillStyle = interpolateColor(data[i]);
          brush.context.fillRect(x, 0, deltaWidth - 1, y);
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
  <audio ref="$audio" style="position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%)" src="Broke For Free.ogg" controls volume="0.5" preload="auto"></audio>
</template>

<style scoped lang="scss"></style>
