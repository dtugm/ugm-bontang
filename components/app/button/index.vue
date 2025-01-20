<template>
  <v-btn class="text-none" :variant="variant" v-bind="$attrs">
    {{ label }}
  </v-btn>
</template>

<script lang="ts" setup>
type Variant = "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";

withDefaults(defineProps<Partial<{ variant?: Variant; label: string }>>(), {
  variant: "elevated",
  label: "label",
});
const appStore = useAppStore();
</script>
