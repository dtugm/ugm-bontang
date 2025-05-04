<template>
  <v-container fluid class="h-full">
    <DashboardStakeHolderProgressKeseluruhan />
    <v-row>
      <v-col cols="12" sm="12">
        <div class="h-[700px] rounded-md">
          <MonitoringSurveyPbb />
        </div>
        <!-- <DashboardStakeHolderScurve /> -->
      </v-col>
    </v-row>
    <DashboardStakeHolderProgressPbb />

    <v-row>
      <v-col cols="12" sm="12">
        <v-card variant="flat">
          <v-container class="h-full">
            <!-- <AppChartV2 :data="mockData" /> -->
            <MonitoringSurveyPbbLogbook />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <DashboardStakeHolderScurve />
      </v-col>
    </v-row>
  </v-container>
</template>
