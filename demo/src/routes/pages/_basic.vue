<script setup lang="ts">
  import { Animator, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';
  import { interpolateColor } from '../../utils/interpolate-color';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    let transformer: Transformer = new Transformer($audio.value!);
    let painter: Painter = new Painter($canvas.value!);
    let animator = new Animator(() => {
      let data = transformer.get();
      painter.update(context => {
        let length = data.length;
        let width = Math.ceil(painter.width / length);
        for (let i = 0; i < length; i++) {
          let x = Math.floor(i * width);
          let y = painter.height;
          let w = width - 1;
          let h = -Math.floor(data[i] * painter.height);

          context.fillStyle = interpolateColor(data[i]);
          context.fillRect(x, y, w, h);
        }
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
    src="Broke For Free - Night Owl.ogg"
    controls
    volume="0.5"
    preload="auto"
  ></audio>
</template>

<style scoped lang="scss"></style>
