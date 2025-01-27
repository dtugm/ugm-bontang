<template>
  <v-textarea
    v-bind="$attrs"
    :id="label || undefined"
    :model-value="modelValue"
    :class="[label ? 'mt-2' : undefined]"
    variant="outlined"
    bg-color="white"
    :density="density || 'comfortable'"
    :placeholder="placeholder || `Enter ${label}`"
    @update:model-value="emit('update:modelValue', $event)"
  >
  </v-textarea>
</template>

<script lang="ts" setup>
type Density = null | "default" | "comfortable" | "compact";

defineProps<
  Partial<{
    modelValue: any;
    label: string;
    placeholder: string;
    density: Density;
    classLabel: string;
  }>
>();
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped></style>
