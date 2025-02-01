<template>
  <v-card variant="flat" class="h-full">
    <v-card-text class="flex justify-between items-center h-full">
      <v-icon size="40" :icon="icon"></v-icon>
      <div class="flex flex-col items-end justify-center h-full text-end">
        <p class="text-sm">Target {{ title }}</p>
        <AppTextH2>{{ targetValue }} {{ valueUnit }}</AppTextH2>
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
    valueUnit: {
      type: String,
      default: "GRID",
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
    icon: {
      type: String,
      default: "mdi-map",
    },
  },
};
</script>
