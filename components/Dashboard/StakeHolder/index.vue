<script setup lang="ts">
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
        <!-- <DashboardStakeHolderScurve /> -->
      </v-col>
    </v-row>
    <DashboardStakeHolderProgressPbb />

    <!-- <v-row>
      <v-col cols="12" sm="12">
        <v-card variant="flat">
          <v-container class="h-full">
            <MonitoringSurveyPbbLogbook />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <DashboardStakeHolderScurve />
      </v-col>
    </v-row> -->
  </v-container>
</template>
