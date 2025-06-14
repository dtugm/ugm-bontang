<template>
  <div id="app" class="theme-default h-screen">
    <slot />
  </div>
</template>
<style scoped>
.rotate-image {
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
}
</style>
