<template>
  <v-card variant="flat" class="h-[calc(100vh-124px-347.88px-30px)]">
    <v-container class="h-full">
      <AppChartV2 v-if="scurveData" :data="scurveData" />
    </v-container>
  </v-card>
  <!-- {{ scurveData }} -->
</template>
<script lang="ts" setup>
import useFirestoreHelper from "~/app/helper/firebase";
const scurveData = ref();
const visualisasi_data = useFirestoreHelper("visualisasi_data");

const COLOR_MAP: any = {
  "Peta Garis": "#4CAF50",
  "3D Models": "#228BE6",
  "Survey PBB": "#EB0E44",
};
const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 100, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "#ffffff00");
  return gradient;
};
visualisasi_data.getOne("s-curve").then((data) => {
  if (!data || !data.datasets || !data.label) {
    console.error("Data Firestore tidak valid:", data);
    return;
  }

  const dataset = data.datasets.map((d: any) => ({
    label: d.label,
    pointBackgroundColor: "white",
    backgroundColor: (ctx: any) => {
      if (!ctx.chart || !ctx.chart.ctx) return "#ffffff00";
      return createGradient(ctx.chart.ctx, COLOR_MAP[d.label] || "#000000");
    },
    borderColor: COLOR_MAP[d.label] || "#000000",
    data: d.data || [],
    fill: true,
    radius: 0,
    borderWidth: 2,
    tension: 0.2,
  }));

  scurveData.value = {
    labels: data.label,
    datasets: dataset,
  };

  console.log("Data dari Firestore:", scurveData.value);
});

// const dataStyle: any = ref([
//   {
//     label: "Peta Garis",
//     pointBackgroundColor: "white",
//     backgroundColor: (ctx: any) => {
//       if (!ctx.chart) return "#ffffff00";
//       const canvas = ctx.chart.ctx;
//       const gradient = canvas.createLinearGradient(0, 0, 100, 400);
//       gradient.addColorStop(0, "#4CAF50");
//       gradient.addColorStop(1, "#ffffff00");
//       return gradient;
//     },
//     borderColor: "#4CAF50",
//     data: [],
//     fill: true,
//     radius: 0,
//     borderWidth: 2,
//     tension: 0.2,
//   },
//   {
//     pointBackgroundColor: "white",
//     label: "3D Models",
//     backgroundColor: (ctx: any) => {
//       if (!ctx.chart) return "#ffffff00";
//       const canvas = ctx.chart.ctx;
//       const gradient = canvas.createLinearGradient(0, 0, 100, 400);
//       gradient.addColorStop(0, "#228BE6");
//       gradient.addColorStop(1, "#ffffff00");
//       return gradient;
//     },
//     borderColor: "#228BE6",
//     data: [],
//     fill: true,
//     radius: 0,
//     borderWidth: 2,
//     tension: 0.25,
//   },
//   {
//     pointBackgroundColor: "white",
//     label: "Survey PBB",
//     backgroundColor: (ctx: any) => {
//       if (!ctx.chart) return "#ffffff00";
//       const canvas = ctx.chart.ctx;
//       const gradient = canvas.createLinearGradient(0, 0, 100, 400);
//       gradient.addColorStop(0, "#EB0E44");
//       gradient.addColorStop(1, "#ffffff00");
//       return gradient;
//     },
//     borderColor: "#EB0E44",
//     data: [],
//     fill: true,
//     radius: 0,
//     borderWidth: 2,
//     tension: 0.25,
//   },
// ]);
// const visualisasi_data = useFirestoreHelper("visualisasi_data");

// visualisasi_data.getOne("s-curve").then((data) => {
//   const dataset = dataStyle.value.map((dataset: any) => {
//     const newData = data.datasets.find((d: any) => d.label === dataset.label);
//     return newData ? { ...dataset, data: newData.data } : dataset;
//   });
//   scurveData.value = {
//     labels: data.label,
//     datasets: dataset,
//   };
// });
</script>
