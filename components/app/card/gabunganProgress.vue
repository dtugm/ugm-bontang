<template>
  <v-card class="pa-4 rounded-lg" :color="color">
    <div v-for="(item, index) in items" :key="index" class="pb-3">
      <div>
        {{ item?.title }}
      </div>
      <div c>
        <div class="d-flex align-start pt-2 px-2">
          <v-icon class="pr-3" size="40">{{ item?.icon }}</v-icon>
          <p class="text-h4">{{ item?.total }}</p>
          <p class="pl-1">{{ item?.unit }}</p>
        </div>
        <div class="flex justify-end text-sm pb-1">Target: {{ item.from }}</div>
      </div>

      <div class="pb-1">
        <v-progress-linear
          :model-value="getPercent(item.total, item.from)"
          height="25"
        >
          <template #default="{ value }">
            <strong :class="`text-${color}`"> {{ value.toFixed(2) }}% </strong>
          </template>
        </v-progress-linear>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
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
    getPercent(total, from) {
      const decimal = total / from;
      const percent = decimal * 100;

      return percent.toFixed(2);
    },
  },
};
</script>
