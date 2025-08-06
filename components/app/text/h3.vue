<template>
  <h2 class="font-bold text-2xl" :class="['text-' + color]">
    <slot></slot>
  </h2>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "text",
    },
  },
};
</script>
