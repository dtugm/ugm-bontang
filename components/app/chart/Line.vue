<template>
  <Line class="h-full" :data="data" :options="options" />
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "App",
  components: {
    Line,
  },
  data() {
    return {
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Peta Garis",
            backgroundColor: "#EB0E44",
            borderColor: "#EB0E44",
            data: [10, 80, 40, 70, 46, 90, 50],
            fill: true,
            radius: 0,
            borderWidth: 2,
            tension: 0.25,
          },
          {
            label: "3d Models",
            backgroundColor: "#228BE6",
            borderColor: "#228BE6",
            data: [10, 70, 30, 60, 33, 80, 40],
            fill: true,
            radius: 0,
            borderWidth: 2,
            tension: 0.25,
          },
          {
            label: "Survey PBB",
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
            data: [10, 80, 50, 60, 30, 80, 40],
            fill: true,
            radius: 0,
            borderWidth: 2,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: "index",
          intersect: false,
        },
      },
    };
  },
};
</script>
