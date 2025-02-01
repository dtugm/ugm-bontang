<template>
  <Line class="h-full w-full" :data="data" :options="chartOptions" />
</template>

<script>
import { Line } from "vue-chartjs";
import dataHandleConstant from "~/app/constant/dataHandle.constant";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  BarElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler,
  BarElement // Add BarElement for bar charts
);

export default {
  name: "LineChart",
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 160,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
    legend: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      dataHandleConstant: dataHandleConstant,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: this.legend,
          },
        },
        scales: {
          y: {
            min: 0,
            ticks: {
              stepSize: 1,
            },
            max: (context) => {
              const chartData = context.chart.data;
              const datasets = chartData.datasets || [];

              if (datasets.length === 0) {
                return 10;
              }

              const data = datasets.reduce((acc, curr) => {
                return [...acc, ...curr.data];
              }, []);

              const maxValue = Math.max(...data);
              return maxValue + 2;
            },
          },
        },
        // plugins: {
        //   legend: {
        //     display: false,
        //   },
        // },
      },
    };
  },
};
</script>
