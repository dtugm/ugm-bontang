<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" sm="4">
        <AppCardInformation
          title="Peta Garis"
          :target-value="514"
          icon="mdi-map"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <AppCardInformation
          title="3D Models"
          :target-value="4497"
          icon="mdi-cube-outline"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <AppCardInformation
          title="Survey PBB"
          :target-value="13000"
          icon="mdi-earth"
          value-unit="persil"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-row>
          <v-col cols="12" sm="4">
            <DashboardPjProgressCardPetaGaris />
          </v-col>
          <v-col cols="12" sm="4">
            <DashboardPjProgressCard3dModels />
          </v-col>
          <v-col cols="12" sm="4">
            <DashboardPjProgressCardSurverPbb />
          </v-col>
          <v-col cols="12" sm="12">
            <v-card variant="flat" class="h-[calc(100vh-124px-347.88px-30px)]">
              <v-container class="h-full">
                <AppChartV2 :data="mockData" />
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col cols="12" sm="3">
        <DashboardLeaderboard />
      </v-col> -->
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
const mockData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Peta Garis",
      pointBackgroundColor: "white",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 200);

        gradient.addColorStop(0, "#4CAF50");
        gradient.addColorStop(1, "#ffffff00");

        return gradient;
      },
      borderColor: "#4CAF50",
      data: [0, 53.31],
      fill: true,
      radius: 0,
      borderWidth: 2,
      tension: 0.25,
    },
    {
      pointBackgroundColor: "white",
      label: "3d Models",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 200);

        gradient.addColorStop(0, "#228BE6");
        gradient.addColorStop(1, "#ffffff00");

        return gradient;
      },
      borderColor: "#228BE6",
      data: [0, 12],
      fill: true,
      radius: 0,
      borderWidth: 2,
      tension: 0.25,
    },
    {
      pointBackgroundColor: "white",
      label: "Survey PBB",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 200);

        gradient.addColorStop(0, "#EB0E44");
        gradient.addColorStop(1, "#ffffff00");

        return gradient;
      },
      borderColor: "#EB0E44",
      data: [0],
      fill: true,
      radius: 0,
      borderWidth: 2,
      tension: 0.25,
    },
  ],
};
</script>
