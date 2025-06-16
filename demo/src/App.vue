<script setup lang="ts">
  import { onMounted } from 'vue';

  let hidden = false;

  onMounted(() => {
    window.addEventListener('keypress', ev => {
      const audio = document.querySelector('audio');

      if (audio) {
        if (ev.code === 'Space') {
          hidden = !hidden;
          audio.style.visibility = hidden ? 'hidden' : 'visible';
        }
      }
    });
  });
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
