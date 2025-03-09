<template>
  <div :class="{ 'd-flex flex-row items-center': vertical }">
    <label v-if="label && !isFilter" :for="label" :class="classLabel">{{
      label
    }}</label>
    <v-text-field
      v-bind="$attrs"
      :id="label || undefined"
      :model-value="modelValue"
      :class="[label && !vertical ? 'mt-2' : undefined]"
      variant="outlined"
      bg-color="white"
      :density="density || 'compact'"
      :placeholder="placeholder || `Enter ${label}`"
      @update:model-value="emit('update:modelValue', $event)"
    >
    </v-text-field>
  </div>
</template>

<script lang="ts" setup>
type Density = null | "default" | "comfortable" | "compact";

interface Props {
  modelValue: any;
  label: string;
  placeholder: string;
  density: Density;
  vertical: boolean;
  isFilter: boolean;
  classLabel: string;
}

defineProps<Partial<Props>>();
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped></style>
