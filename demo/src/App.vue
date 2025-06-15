<script setup lang="ts">
  import { onMounted } from 'vue';

  let hidden = false;

  onMounted(() => {
    const audio = document.querySelector('audio');

    window.addEventListener('keypress', ev => {
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
