<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template #activator="{ props }">
      <label v-if="label && !isFilter" :for="label" :class="classLabel">{{
        label
      }}</label>
      <v-text-field
        :model-value="formattedDate"
        readonly
        density="compact"
        variant="outlined"
        bg-color="white"
        :label="label && isFilter ? label : undefined"
        clearable
        hide-details
        append-inner-icon="mdi-calendar-month"
        v-bind="{ ...props, ...$attrs }"
        :placeholder="placeholder || `Enter ${label}`"
        @click:clear="callItBack()"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="selectedDate"
      hide-actions
      title=""
      :color="color"
      show-adjacent-months
    >
      <template #header></template>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps, defineEmits } from "vue";

const props = defineProps<{
  label?: string;
  color?: string;
  modelValue?: string | Date | null;
  classLabel?: string;
  isFilter?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue", "clear"]);

const isMenuOpen = ref(false);
const selectedDate = ref<Date | null>(null);

// Konversi modelValue menjadi Date jika bukan null/undefined
if (props.modelValue) {
  selectedDate.value =
    typeof props.modelValue === "string"
      ? new Date(props.modelValue)
      : props.modelValue;
}

// Format tanggal ke lokal Indonesia
const formattedDate = computed(() =>
  selectedDate.value ? selectedDate.value.toLocaleDateString("id") : ""
);

function formatDate(date: Date) {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Perbaikan watch() untuk modelValue (menggunakan getter)
watch(
  () => props.modelValue,
  (newDate) => {
    if (newDate) {
      selectedDate.value =
        typeof newDate === "string" ? new Date(newDate) : newDate;
    } else {
      selectedDate.value = null;
    }
  }
);

// Perbaikan watch() untuk selectedDate
watch(selectedDate, (newDate) => {
  if (newDate) {
    emit("update:modelValue", formatDate(newDate));
  } else {
    emit("update:modelValue", null);
  }
});

const callItBack = () => {
  emit("clear");
};
</script>

<style>
.v-overlay__content:has(> .v-date-picker) {
  min-width: auto !important;
}
.v-picker-title {
  padding: 0 !important;
}
</style>
