<template>
  <v-card :loading="isLoading" variant="flat" class="border">
    <v-card-title class="bg-gray-100">
      <v-row class="p-3" justify="space-between" align="center">
        <AppTextH5 color="text">{{ title }}</AppTextH5>
        <slot name="action"></slot>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-3 flex flex-col gap-3">
      <slot></slot>
    </v-card-text>
    <slot name="footer" />
  </v-card>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string;
    isLoading?: boolean;
  }>(),
  {
    title: "Title",
    isLoading: false,
  }
);
</script>
