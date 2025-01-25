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
    <v-window-item value="peta_garis_progress"></v-window-item>
    <v-window-item value="tabel_pembagian_tugas"></v-window-item>
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
