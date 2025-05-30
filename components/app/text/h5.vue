<template>
  <h5 class="font-bold text-base" :class="['text-' + color]" v-bind="$attrs">
    <slot></slot>
  </h5>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "primary",
    },
  },
};
</script>
