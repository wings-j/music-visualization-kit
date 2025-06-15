<script setup lang="ts">
  import Color from 'color';
  import { pull } from 'lodash-es';
  import { mean } from 'mathjs';
  import { Animator, Layout, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas = ref<HTMLCanvasElement>();
  const colors = {
    center: Color('#FA5848'),
    innerRing: Color('#FA5740'),
    outerRing: Color('#FA812F')
  };

  onMounted(() => {
    let transformer: Transformer = new Transformer($audio.value!);
    let painter: Painter = new Painter($canvas.value!, { center: true, trace: 0.98 });

    let centerSize = Math.max(painter.width, painter.height) * 0.5;
    let centerRipples: {
      radius: 0;
    }[] = [];
    let ringRadius = Math.min(painter.width, painter.height) * 0.3;
    let ringTrace = new Array<number>(64).fill(0);

    let animator = new Animator(() => {
      let data = transformer.get().slice(64, 128);
      let average = mean(data);
      let bass = transformer.get().slice(0, 8);
      let bassAverage = mean(bass);

      painter.update(brush => {
        var gradient = brush.context.createRadialGradient(0, 0, 0, 0, 0, centerSize * average);
        gradient.addColorStop(0, colors.center.hex());
        gradient.addColorStop(0.1, colors.center.alpha(0.5).hex());
        gradient.addColorStop(0.2, 'transparent');
        gradient.addColorStop(1, 'transparent');
        brush.context.fillStyle = gradient;
        brush.context.beginPath();
        brush.context.arc(0, 0, centerSize, 0, Math.PI * 2, true);
        brush.context.fill();

        if (bassAverage > 0.82) {
          centerRipples.push({ radius: 0 });
        }
        for (let a of centerRipples) {
          a.radius += 8;
          if (a.radius > centerSize * 2) {
            pull(centerRipples, a);
          }

          brush.context.beginPath();
          brush.context.arc(0, 0, a.radius, 0, Math.PI * 2, true);
          brush.context.strokeStyle = colors.center.alpha(0.07).rgb().toString();
          brush.context.stroke();
        }

        for (let i = 0; i < data.length; i++) {
          ringTrace[i] = Math.max(data[i], ringTrace[i] - 0.005);
        }
        brush.context.strokeStyle = colors.outerRing.rotate(average * -30).hex();
        brush.drawCurve(Layout.circular(ringTrace, ringRadius, ringRadius), { closed: true });

        brush.context.strokeStyle = colors.innerRing.rotate(average * -45).hex();
        brush.drawCurve(Layout.circular(data, ringRadius, ringRadius * 1.4), { closed: true });
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
  <canvas ref="$canvas" style="width: 100vw; height: 100vh; background-color: black"></canvas>
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
