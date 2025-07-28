<template>
  <v-btn icon variant="flat" rounded="sm" density="compact">
    <v-icon color="tertiary">{{ icon }}</v-icon>
  </v-btn>
</template>
<script setup lang="ts">
defineProps({
  icon: String,
});
</script>
