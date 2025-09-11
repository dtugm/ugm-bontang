<script setup lang="ts">
const tab = ref();
// import { MonitoringSurveyPbbOptimized } from "#components";
</script>

<template>
  <v-container fluid class="h-full">
    <DashboardStakeHolderProgressKeseluruhan />
    <v-row>
      <v-col cols="12" sm="12">
        <div class="h-[500px] rounded-md">
          <MonitoringSurveyPbbOptimized />
        </div>
      </v-col>
    </v-row>
    <DashboardStakeHolderProgressPbb />
  </v-container>
</template>
