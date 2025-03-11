<template>
  <div :class="{ 'd-flex flex-row items-center': vertical }">
    <label v-if="label && !isFilter" :for="label" :class="classLabel">{{
      label
    }}</label>
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
  </div>
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
    isFilter: boolean;
    vertical: boolean;
  }>
>();
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped></style>
