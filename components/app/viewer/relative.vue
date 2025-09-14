<template>
  <div v-if="isLoading" class="overlay-loading flex flex-col">
    <v-progress-circular indeterminate color="white" size="64" />
    <p class="text-white">Please wait...</p>
  </div>
  <div class="viewer-container relative w-screen h-screen">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false,
  },
});
</script>
<style scoped>
.overlay-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* agak gelap */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.viewer-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
