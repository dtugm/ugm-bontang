<template>
  <v-card :loading="loading" class="pa-4 rounded-lg" :color="color">
    <slot name="overlay">
      <v-overlay
        v-model="isLoading"
        absolute
        class="align-center justify-center"
        contained
      >
        <v-progress-circular size="50" color="white" indeterminate>
        </v-progress-circular>
      </v-overlay>
    </slot>

    <!-- Tambahkan flex dan height 100% di container utama -->
    <div class="flex flex-col h-full">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="pb-3 text-[16px] flex-1 flex flex-col"
      >
        <div>
          {{ item?.title }}
        </div>

        <!-- Tambahkan flex-1 agar konten ini mengisi ruang yang tersisa -->
        <div class="flex-1 flex flex-col">
          <div class="d-flex align-start pt-2 px-2">
            <v-icon v-if="item.icon" class="pr-3" size="40">{{
              item?.icon
            }}</v-icon>
            <p class="text-h5">{{ item?.total }}</p>
            <p class="pl-1 text-[10px]">{{ item?.unit }}</p>
          </div>

          <div class="flex justify-end text-[12px] pb-1">
            Target: {{ item.from }}
          </div>
        </div>

        <div class="pb-1">
          <v-progress-linear
            :model-value="getPercent(item.total, item.from)"
            height="25"
          >
            <template #default="{ value }">
              <strong :class="`text-${color}`">
                {{ value.toFixed(2) }}%
              </strong>
            </template>
          </v-progress-linear>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      overlay: true,
    };
  },
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
    isLoading() {
      return this.loading;
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
