<script setup lang="ts">
  import Color from 'color';
  import { pull } from 'lodash-es';
  import { mean } from 'mathjs';
  import { Animator, Layout, Painter, Transformer } from 'music-visualization-kit';
  import { onMounted, ref } from 'vue';

  const $audio = ref<HTMLAudioElement>();
  const $canvas1 = ref<HTMLCanvasElement>();
  const $canvas2 = ref<HTMLCanvasElement>();
  const colors = {
    center: Color('#FA5848'),
    innerRing: Color('#FA5740'),
    outerRing: Color('#FA812F')
  };

  onMounted(() => {
    let transformer: Transformer = new Transformer($audio.value!);
    let painter1: Painter = new Painter($canvas1.value!, { center: true, trace: 0.95 });
    let painter2: Painter = new Painter($canvas2.value!, { center: true, trace: 0.98 });

    let centerSize = Math.max(painter2.width, painter2.height) * 0.5;
    let centerRipples: {
      radius: 0;
    }[] = [];
    let ringRadius = Math.min(painter2.width, painter2.height) * 0.3;
    let ringTrace = new Array<number>(64).fill(0);

    let animator = new Animator(() => {
      let frequencyData = transformer.get().slice(64, 128);
      let average = mean(frequencyData);
      let bass = transformer.get().slice(0, 8);
      let bassAverage = mean(bass);

      painter1.update(brush => {});
      painter2.update(brush => {
        var gradient = brush.context.createRadialGradient(0, 0, 0, 0, 0, centerSize * average);
        gradient.addColorStop(0, colors.center.hex());
        gradient.addColorStop(
          0.1,
          colors.center
            .alpha(0.5)
            .rotate(average * -30)
            .rgb()
            .toString()
        );
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
          brush.context.strokeStyle = colors.center.alpha(0.055).rgb().toString();
          brush.context.stroke();
        }

        for (let i = 0; i < frequencyData.length; i++) {
          ringTrace[i] = Math.max(frequencyData[i], ringTrace[i] - 0.005);
        }
        brush.context.strokeStyle = colors.outerRing.rotate(average * -30).hex();
        brush.drawCurve(Layout.circular(ringTrace, ringRadius, ringRadius), { closed: true });

        brush.context.strokeStyle = colors.innerRing.rotate(average * -45).hex();
        brush.drawCurve(Layout.circular(frequencyData, ringRadius, ringRadius * 1.4), { closed: true });
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
  <canvas ref="$canvas1" style="position: fixed; left: 0; right: 0; width: 100vw; height: 100vh; background-color: black"></canvas>
  <canvas ref="$canvas2" style="position: fixed; left: 0; right: 0; width: 100vw; height: 100vh"></canvas>
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
