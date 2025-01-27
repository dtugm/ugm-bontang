<template>
  <div :class="{ 'd-flex flex-row items-center': isFilter }">
    <label v-if="label && !isFilter" :for="label" :class="classLabel">
      {{ label }}
    </label>
    <v-select
      :id="label || undefined"
      v-bind="$attrs"
      :model-value="modelValue"
      :class="[label && !isFilter ? 'mt-2' : undefined]"
      variant="outlined"
      :label="label && isFilter ? label : undefined"
      bg-color="white"
      :density="density || 'compact'"
      :placeholder="placeholder || `Enter ${label}`"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <!-- <template #item="{ props, item }">
        <slot name="item" v-bind="{ props, item }"> </slot>
      </template> -->
      <!-- prettier-ignore-attribute -->
      <template
        v-for="(_, name, slot_index) in ($slots as {})"
        :key="slot_index"
        #[name]="scoped"
      >
        <slot :name="name" v-bind="{ ...(scoped as object) }" />
      </template>
    </v-select>
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
    isFilter: boolean;
    classLabel: string;
  }>
>();
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped></style>
