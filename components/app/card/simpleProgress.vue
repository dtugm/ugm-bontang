<template>
  <v-card class="pa-4 rounded-lg" :color="color">
    <div>
      {{ title }}
    </div>
    <div class="d-flex align-start py-2 px-2">
      <v-icon class="pr-3" size="40">{{ icon }}</v-icon>
      <p class="text-h4">{{ total }}</p>
      <p class="pl-1">{{ unit }}</p>
    </div>

    <div class="pb-1">
      <v-progress-linear :model-value="getPercent()" height="25">
        <template #default="{ value }">
          <strong :class="`text-${color}`"> {{ value }}% </strong>
        </template>
      </v-progress-linear>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "mdi-monitor",
    },
    title: {
      type: String,
      default: "Title Card",
    },
    total: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "kilometer",
    },
    color: {
      type: String,
      default: "white",
    },
    from: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    progressValue() {
      this.getPercent();
    },
  },
  methods: {
    getPercent() {
      const decimal = this.total / this.from;
      const percent = decimal * 100;

      return percent.toFixed(2);
    },
  },
};
</script>
