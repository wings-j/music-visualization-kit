<script setup lang="ts">
  const categories = [
    {
      name: 'Basic',
      route: 'basic',
      code: 'https://github.com/wings-j/music-visualization-kit/blob/main/demo/src/routes/pages/_basic.vue',
      music: 'Broke For Free - Night Owl',
      sourceName: 'Free Music Archive',
      sourceUrl: 'https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/'
    }
  ];
</script>

<template>
  <div style="max-width: 800px; padding: 30px 0; margin: 0 auto">
    <div style="font-size: 30px">Music Visualization Demos</div>
    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px">
      <router-link
        v-for="a of categories"
        class="category"
        style="padding: 16px; border: 1px solid #dddddd; text-decoration: none; border-radius: 8px; background-color: white; cursor: default; transition: box-shadow 0.3s"
        :to="{ name: a.route }"
      >
        <div>{{ a.name }}</div>
        <div style="display: flex; margin-top: 8px; color: #333333; font-size: 14px">
          <a style="text-decoration: none" :href="a.code" target="_blank" @click.stop>
            <img style="width: 14px; height: 14px" src="../assets/github.svg" />
          </a>
          <span style="margin-left: auto; color: #888888">Music: </span>
          <span style="margin-left: 10px">{{ a.music }}</span>
          <a
            v-if="a.sourceName && a.sourceUrl"
            style="margin-left: 20px; border-bottom: 1px solid #999999; color: inherit; text-decoration: none"
            :href="a.sourceUrl"
            target="_blank"
            @click.stop
          >
            <span>Source:</span>
            <span style="margin-left: 10px">{{ a.sourceName }}</span>
          </a>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
  .category:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>
