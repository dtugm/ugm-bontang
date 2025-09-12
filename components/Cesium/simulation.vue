<template>
  <v-menu :close-on-content-click="false" location="left">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        color="tertiary"
        v-bind="activatorProps"
        class="text-none mt-1"
        icon
      >
        <v-icon>mdi-home-flood</v-icon>
      </v-btn>
    </template>

    <v-card class="rounded-lg" width="300">
      <v-card-text>
        <div class="text-subtitle-2 mb-2">Tinggi Banjir (Sungai UPPT PKT)</div>
        <v-slider
          :model-value="modelValue"
          :min="60"
          :max="75"
          :step="4"
          class="mb-2"
          :ticks="viewerConstant.floodTickLabel"
          show-ticks="always"
          hide-details
          @update:model-value="emit('update:modelValue', $event)"
        ></v-slider>

        <v-btn block color="tertiary" class="mt-5" @click="emit('start')">
          Start
        </v-btn>

        <div class="flex justify-between">
          <v-btn color="primary-blue" class="mt-5" @click="emit('reset')">
            Reset
          </v-btn>
          <v-btn color="success" class="mt-5" @click="emit('pause')">
            Pause
          </v-btn>
          <v-btn color="error" class="mt-5" @click="emit('stop')"> Stop </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import viewerConstant from "~/app/constant/viewer.constant";

interface Props {
  modelValue: number; // maxHeight dari parent
  min?: number;
  max?: number;
  step?: number;
  tickLabels?: Record<number, string>;
}

const props = withDefaults(defineProps<Props>(), {
  min: 60,
  max: 90,
  step: 5,
});
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "start"): void;
  (e: "reset"): void;
  (e: "pause"): void;
  (e: "stop"): void;
}>();
</script>
