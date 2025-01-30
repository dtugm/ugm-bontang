<template>
  <v-card class="h-full" variant="flat">
    <template #text>
      <v-row justify="end">
        <v-col class="text-lg">
          Total
          <span class="text-primary font-bold"> {{ title }} </span>
          <div class="flex items-end gap-1">
            <AppTextH2>{{ progress }}</AppTextH2>
          </div>
          <p class="text-sm">Target: {{ totalValue }} {{ unit }}</p>
        </v-col>
        <v-col class="flex justify-end">
          <v-progress-circular
            :color="handleColor(valueProgress)"
            :model-value="valueProgress"
            :size="80"
            :width="10"
          >
            <p class="text-text">{{ progress }} / {{ totalValue }}</p>
          </v-progress-circular>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "Title",
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "satuan",
    },
  },
  computed: {
    valueProgress() {
      return this.handleNan((this.progress / this.totalValue) * 100);
    },
  },
  methods: {
    handleNan(value) {
      if (isNaN(value)) {
        return 0;
      } else {
        return value;
      }
    },
    handleColor(value) {
      if (value > 20 && value < 75) {
        return "warning";
      } else if (value > 75) {
        return "success";
      } else {
        return "error";
      }
    },
  },
};
</script>
