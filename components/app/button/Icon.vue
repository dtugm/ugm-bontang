<template>
  <v-btn icon variant="flat" rounded="sm" density="compact">
    <v-icon :color="iconColor">{{ icon }}</v-icon>
  </v-btn>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    iconColor?: string;
  }>(),
  {
    icon: "mdi-eye",
    iconColor: "tertiary",
  }
);
</script>
