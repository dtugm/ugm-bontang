<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" lg="3">
        <AppTextH2> Progress Dashboard </AppTextH2>
      </v-col>
      <v-col cols="12" lg="3">
        <AppCardSimpleProgress
          title="Pembuatan Peta Kerja"
          :total="400"
          :from="514"
          unit="Grid"
          icon="mdi-folder-information-outline"
          color="tertiary"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <AppCardSimpleProgress
          title="Pembuatan Peta Kerja"
          :total="10"
          :from="40"
          unit="Grid"
          icon="mdi-folder-information-outline"
          color="secondary"
      /></v-col>
      <v-col cols="12" lg="3">
        <AppCardSimpleProgress
          title="Pembuatan Peta Kerja"
          :total="10"
          :from="40"
          unit="Features"
          icon="mdi-folder-information-outline"
          color="success"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card variant="flat" class="h-[calc(100vh-124px-347.88px-30px)]">
          <v-container class="h-full">
            <AppChartV2 :data="mockData" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4">
        <AppCardSimpleProgress
          title="Bontang Baru"
          :total="400"
          :from="514"
          unit="Bidang Tanah"
          icon="mdi-folder-information-outline"
          color="tertiary"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <AppCardSimpleProgress
          title="Api Api"
          :total="10"
          :from="40"
          unit="Grid"
          icon="mdi-folder-information-outline"
          color="secondary"
      /></v-col>
      <v-col cols="12" lg="4">
        <AppCardSimpleProgress
          title="Loktuan"
          :total="10"
          :from="40"
          unit="Features"
          icon="mdi-folder-information-outline"
          color="success"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="4">
        <AppCardSimpleProgress
          title="Bontang Baru"
          :total="400"
          :from="514"
          unit="Bidang Tanah"
          icon="mdi-folder-information-outline"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <AppCardSimpleProgress
          title="Api Api"
          :total="10"
          :from="40"
          unit="Grid"
          icon="mdi-folder-information-outline"
      /></v-col>
      <v-col cols="12" lg="4">
        <AppCardSimpleProgress
          title="Loktuan"
          :total="10"
          :from="40"
          unit="Features"
          icon="mdi-folder-information-outline"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12">
        <v-card variant="flat" class="h-[calc(100vh-124px-347.88px-30px)]">
          <v-container class="h-full">
            <AppChartV2 :data="mockData" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
const mockData = {
  labels: [
    "Jan W1",
    "Jan W2",
    "Jan W3",
    "Jan W4",
    "Feb W1",
    "Feb W2",
    "Feb W3",
    "Feb W4",
    "Mar W1",
    "Mar W2",
    "Mar W3",
    "Mar W4",
  ],
  datasets: [
    {
      label: "Peta Garis",
      pointBackgroundColor: "white",
      backgroundColor: (ctx: any) => {
        if (!ctx.chart) return "#ffffff00";
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 100, 400);
        gradient.addColorStop(0, "#4CAF50");
        gradient.addColorStop(1, "#ffffff00");
        return gradient;
      },
      borderColor: "#4CAF50",
      data: [0, 12, 20.6, 32.8, 45.6, 59.2, 70.9, 75, 80, 82],
      fill: true,
      radius: 0,
      borderWidth: 2,
      tension: 0.2,
    },
    {
      pointBackgroundColor: "white",
      label: "3D Models",
      backgroundColor: (ctx: any) => {
        if (!ctx.chart) return "#ffffff00";
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 100, 400);
        gradient.addColorStop(0, "#228BE6");
        gradient.addColorStop(1, "#ffffff00");
        return gradient;
      },
      borderColor: "#228BE6",
      data: [0, 0, 2, 2.3, 2.7, 3, 3.7, 4, 4.2, 5], // Tambahkan titik kedua agar terlihat
      fill: true,
      radius: 0,
      borderWidth: 2,
      tension: 0.25,
    },
    {
      pointBackgroundColor: "white",
      label: "Survey PBB",
      backgroundColor: (ctx: any) => {
        if (!ctx.chart) return "#ffffff00";
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 100, 400);
        gradient.addColorStop(0, "#EB0E44");
        gradient.addColorStop(1, "#ffffff00");
        return gradient;
      },
      borderColor: "#EB0E44",
      data: [0, 0, 0, 0, 0, 1, 1.3, 2, 4, 7.12],
      fill: true,
      radius: 0,
      borderWidth: 2,
      tension: 0.25,
    },
  ],
};
</script>
