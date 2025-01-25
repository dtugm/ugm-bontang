<template>
  <v-tabs
    v-model="tab"
    color="primary"
    density="compact"
    selected-class="font-weight-bold"
  >
    <v-tab
      v-for="(item, index) in tabs"
      :key="index"
      :value="item.value"
      class="text-none"
    >
      {{ item.text }}
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="peta_garis_progress">
      <PetaGarisPetaProgress />
    </v-window-item>

    <v-window-item value="tabel_pembagian_tugas"> peta progress </v-window-item>

    <v-window-item value="site-completed">
      <AnalyticSummaryGsTabsSiteCompleted class="my-5" />
    </v-window-item>

    <v-window-item value="activity-plaining">
      <AnalyticSummaryGsTabsActivityPlaining class="my-5" />
    </v-window-item>
  </v-window>
</template>
<script lang="ts" setup>
const tab = ref();
const tabs = [
  {
    text: "Peta Garis Progress",
    value: "peta_garis_progress",
  },
  {
    text: "Table Pembagian Tugas",
    value: "tabel_pembagian_tugas",
  },
];
</script>
