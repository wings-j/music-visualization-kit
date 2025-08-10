<script setup lang="ts">
  import { Animator, Data, Layout, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();

  onMounted(() => {
    let transformer: Transformer = new Transformer($audio.value!);
    let painter: Painter = new Painter($canvas.value!, { trace: 0.97 });

    let animator = new Animator(() => {
      let data = Data.extract(transformer.get(), 3);
      let length = data.length;
      let window = Math.floor(length / 3);

      let lowFrequency = data.slice(0, window);
      for (let i = 0; i < lowFrequency.length; i++) {
        lowFrequency[i] = 1 - lowFrequency[i] * 0.8;
      }
      let middleFrequency = data.slice(window, window * 2);
      for (let i = 0; i < middleFrequency.length; i++) {
        middleFrequency[i] = 1 - middleFrequency[i] * 0.8;
      }
      let highFrequency = data.slice(window * 2, Math.floor(window * 2 + window / 2)).reverse();
      highFrequency.push(0);
      for (let i = 0; i < highFrequency.length; i++) {
        highFrequency[i] = 1 - Math.sqrt(highFrequency[i]) * 0.8;
      }
      let lowLayout = Layout.linear(lowFrequency, painter.width, painter.height);
      let middleLayout = Layout.linear(middleFrequency, painter.width, painter.height);
      let highLayout = Layout.linear(highFrequency, painter.width, painter.height);

      painter.update(brush => {
        brush.context.fillStyle = '#87BBEB77';
        brush.drawCurve(highLayout);
        brush.context.lineTo(painter.width, painter.height);
        brush.context.lineTo(0, painter.height);
        brush.context.fill();

        brush.context.fillStyle = '#86EBCC77';
        brush.drawCurve(lowLayout);
        brush.context.lineTo(painter.width, painter.height);
        brush.context.lineTo(0, painter.height);
        brush.context.fill();

        brush.context.fillStyle = '#6EDEEB77';
        brush.drawCurve(middleLayout);
        brush.context.lineTo(painter.width, painter.height);
        brush.context.lineTo(0, painter.height);
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
    src="music-visualization-resource/This is Water.ogg"
    controls
    volume="0.5"
    preload="auto"
  ></audio>
</template>

<style scoped lang="scss"></style>
