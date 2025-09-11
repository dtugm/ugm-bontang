<script setup lang="ts">
const tab = ref();
// import { MonitoringSurveyPbbOptimized } from "#components";
</script>

<template>
  <v-container fluid class="h-full">
    <v-tabs v-model="tab" bg-color="" align-tabs="center">
      <v-tab value="one">Progress Statistik</v-tab>
      <v-tab value="two">Web GIS</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="one">
        <DashboardStakeHolderProgressKeseluruhan />
        <DashboardStakeHolderProgressPbb />
      </v-window-item>
      <v-window-item value="two">
        <Peta />
      </v-window-item>
    </v-window>
  </v-container>
</template>
