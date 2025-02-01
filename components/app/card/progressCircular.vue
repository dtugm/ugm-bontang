<template>
  <v-card variant="flat" class="shadow-lg">
    <v-card-title>{{ title }}</v-card-title>
    <!-- <v-card-subtitle> {{ targetValue }}</v-card-subtitle> -->
    <v-card-text>
      <div class="flex justify-center">
        <v-progress-circular
          :model-value="(value / targetValue) * 100"
          :size="200"
          :width="30"
          :color="doneColor"
          class="mb-1"
        >
          <p class="text-2xl font-semibold text-text">
            {{ ((value / targetValue) * 100).toFixed(2) }}%
          </p>
        </v-progress-circular>
      </div>
      <div class="flex gap-1 items-center">
        <v-sheet :height="15" :width="15" :color="doneColor"></v-sheet>
        <p>Done</p>
      </div>
      <div class="flex gap-1 items-center">
        <v-sheet :height="15" :width="15" :color="progressColor"></v-sheet>
        <p>On Progress</p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "Title",
    },
    value: {
      type: Number,
      default: 0,
    },
    targetValue: {
      type: Number,
      default: 100,
    },
    doneColor: {
      type: String,
      default: "success",
    },
    progressColor: {
      type: String,
      default: "grey",
    },
  },
};
</script>
