<script setup lang="ts">
  import { Animator, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    let transformer: Transformer = new Transformer($audio.value!);
    let painter: Painter = new Painter($canvas.value!);
    let animator = new Animator(() => {
      let data = transformer.get();
      painter.update(context => {});
    });

    animator.play();
  });
</script>

<template>
  <canvas ref="$canvas" style="width: 100vw; height: 100vh"></canvas>
  <audio
    ref="$audio"
    style="position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%)"
    src="./music-visualization-resource/Cathy.ogg"
    controls
    volume="0.5"
    preload="auto"
  ></audio>
</template>

<style scoped></style>
