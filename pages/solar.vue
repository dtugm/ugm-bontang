<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
    <v-container fluid class="py-8">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          <v-icon color="orange" size="48" class="mr-4">mdi-solar-power</v-icon>
          Solar Panel Analysis Dashboard
        </h1>
        <p class="text-gray-600 text-lg">
          Comprehensive analysis of
          {{ data.analysis_overview.total_buildings }} buildings
        </p>
        <v-chip color="primary" class="mt-2">
          <v-icon left>mdi-calendar</v-icon>
          {{ formatDate(data.analysis_overview.analysis_date) }}
        </v-chip>
      </div>

      <!-- Overview Cards -->
      <v-row class="mb-8">
        <v-col
          cols="12"
          md="3"
          v-for="(card, index) in overviewCards"
          :key="index"
        >
          <v-card
            class="h-full hover:shadow-lg transition-shadow duration-300"
            :color="card.color"
            dark
          >
            <v-card-text class="text-center">
              <v-icon size="48" class="mb-3">{{ card.icon }}</v-icon>
              <h3 class="text-2xl font-bold mb-2">{{ card.value }}</h3>
              <p class="text-sm opacity-90">{{ card.title }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section -->
      <v-row class="mb-8">
        <!-- Building Suitability Chart -->
        <v-col cols="12" lg="6">
          <v-card class="h-full">
            <v-card-title
              class="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            >
              <v-icon left>mdi-chart-pie</v-icon>
              Building Suitability Distribution
            </v-card-title>
            <v-card-text class="pa-6">
              <canvas ref="suitabilityChart" height="300"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Capacity Chart -->
        <v-col cols="12" lg="6">
          <v-card class="h-full">
            <v-card-title
              class="bg-gradient-to-r from-green-500 to-green-600 text-white"
            >
              <v-icon left>mdi-chart-bar</v-icon>
              Total Capacity by Category (kW)
            </v-card-title>
            <v-card-text class="pa-6">
              <canvas ref="capacityChart" height="300"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Savings Analysis -->
      <v-row class="mb-8">
        <v-col cols="12">
          <v-card>
            <v-card-title
              class="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            >
              <v-icon left>mdi-currency-usd</v-icon>
              Annual Savings by Tariff Type (Billion IDR)
            </v-card-title>
            <v-card-text class="pa-6">
              <canvas ref="savingsChart" height="200"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Detailed Breakdown -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title
              class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
            >
              <v-icon left>mdi-table</v-icon>
              Detailed Suitability Breakdown
            </v-card-title>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="tableHeaders"
                :items="tableItems"
                class="elevation-0"
                :items-per-page="10"
              >
                <template v-slot:item.category="{ item }">
                  <v-chip :color="getCategoryColor(item.category)" dark small>
                    {{ item.category }}
                  </v-chip>
                </template>
                <template v-slot:item.building_count="{ item }">
                  <span class="font-weight-bold">{{
                    item.building_count.toLocaleString()
                  }}</span>
                </template>
                <template v-slot:item.moderate_capacity="{ item }">
                  <span class="text-blue-600 font-weight-medium"
                    >{{ item.moderate_capacity }} kW</span
                  >
                </template>
                <template v-slot:item.maximum_capacity="{ item }">
                  <span class="text-green-600 font-weight-medium"
                    >{{ item.maximum_capacity }} kW</span
                  >
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tariff Information -->
      <v-row class="mt-8">
        <v-col
          cols="12"
          md="4"
          v-for="(tariff, key) in data.tariff_information"
          :key="key"
        >
          <v-card class="h-full hover:shadow-lg transition-shadow duration-300">
            <v-card-title
              class="bg-gradient-to-r from-orange-400 to-orange-500 text-white"
            >
              <v-icon left>mdi-flash</v-icon>
              {{ key }}
            </v-card-title>
            <v-card-text>
              <div class="mb-3">
                <h4 class="font-semibold text-gray-700">Rate per kWh</h4>
                <p class="text-2xl font-bold text-orange-600">
                  IDR {{ tariff.rate_per_kwh.toLocaleString() }}
                </p>
              </div>
              <div class="mb-3">
                <h4 class="font-semibold text-gray-700">Category</h4>
                <p class="text-sm text-gray-600">{{ tariff.category }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-700">Description</h4>
                <p class="text-sm text-gray-600">{{ tariff.description }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import solarData from "~/app/json/solar_cost_savings_summary.json";

Chart.register(...registerables);

interface SolarData {
  analysis_overview: {
    total_buildings: number;
    analysis_date: string;
    currency: string;
    system_lifetime_years: number;
    discount_rate_percent: number;
    inflation_rate_percent: number;
  };
  tariff_information: Record<
    string,
    {
      rate_per_kwh: number;
      description: string;
      category: string;
    }
  >;
  suitability_breakdown: Record<
    string,
    {
      building_count: number;
      total_moderate_capacity_kw: number;
      total_maximum_capacity_kw: number;
      average_moderate_energy_kwh_year: number;
      average_maximum_energy_kwh_year: number;
    }
  >;
  cost_savings_summary: Record<
    string,
    {
      total_moderate_annual_savings_billion_rp: number;
      total_maximum_annual_savings_billion_rp: number;
      total_moderate_lifetime_savings_billion_rp: number;
      total_maximum_lifetime_savings_billion_rp: number;
    }
  >;
}

const data = ref<SolarData>(solarData as SolarData);
const suitabilityChart = ref<HTMLCanvasElement>();
const capacityChart = ref<HTMLCanvasElement>();
const savingsChart = ref<HTMLCanvasElement>();

const overviewCards = computed(() => [
  {
    title: "Total Buildings",
    value: data.value.analysis_overview.total_buildings.toLocaleString(),
    icon: "mdi-home-group",
    color: "blue",
  },
  {
    title: "System Lifetime",
    value: `${data.value.analysis_overview.system_lifetime_years} Years`,
    icon: "mdi-clock-outline",
    color: "green",
  },
  {
    title: "Discount Rate",
    value: `${data.value.analysis_overview.discount_rate_percent}%`,
    icon: "mdi-percent",
    color: "orange",
  },
  {
    title: "Inflation Rate",
    value: `${data.value.analysis_overview.inflation_rate_percent}%`,
    icon: "mdi-trending-up",
    color: "purple",
  },
]);

const tableHeaders = [
  { title: "Category", key: "category", sortable: true },
  { title: "Buildings", key: "building_count", sortable: true },
  { title: "Moderate Capacity", key: "moderate_capacity", sortable: true },
  { title: "Maximum Capacity", key: "maximum_capacity", sortable: true },
  {
    title: "Avg Energy (Moderate)",
    key: "avg_moderate_energy",
    sortable: true,
  },
  { title: "Avg Energy (Maximum)", key: "avg_maximum_energy", sortable: true },
];

const tableItems = computed(() => {
  return Object.entries(data.value.suitability_breakdown).map(
    ([category, details]) => ({
      category,
      building_count: details.building_count,
      moderate_capacity: details.total_moderate_capacity_kw.toFixed(2),
      maximum_capacity: details.total_maximum_capacity_kw.toFixed(2),
      avg_moderate_energy: details.average_moderate_energy_kwh_year.toFixed(2),
      avg_maximum_energy: details.average_maximum_energy_kwh_year.toFixed(2),
    })
  );
});

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Prime: "green",
    Suitable: "blue",
    Marginal: "orange",
    "Not Recommended": "red",
  };
  return colors[category] || "grey";
};

const createSuitabilityChart = () => {
  if (!suitabilityChart.value) return;

  const ctx = suitabilityChart.value.getContext("2d");
  if (!ctx) return;

  const categories = Object.keys(data.value.suitability_breakdown);
  const buildingCounts = Object.values(data.value.suitability_breakdown).map(
    (item) => item.building_count
  );

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: [
        {
          data: buildingCounts,
          backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#F44336"],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
      },
    },
  });
};

const createCapacityChart = () => {
  if (!capacityChart.value) return;

  const ctx = capacityChart.value.getContext("2d");
  if (!ctx) return;

  const categories = Object.keys(data.value.suitability_breakdown);
  const moderateCapacity = Object.values(data.value.suitability_breakdown).map(
    (item) => item.total_moderate_capacity_kw
  );
  const maximumCapacity = Object.values(data.value.suitability_breakdown).map(
    (item) => item.total_maximum_capacity_kw
  );

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Moderate Capacity",
          data: moderateCapacity,
          backgroundColor: "#42A5F5",
          borderRadius: 4,
        },
        {
          label: "Maximum Capacity",
          data: maximumCapacity,
          backgroundColor: "#66BB6A",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Capacity (kW)",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
};

const createSavingsChart = () => {
  if (!savingsChart.value) return;

  const ctx = savingsChart.value.getContext("2d");
  if (!ctx) return;

  const tariffTypes = Object.keys(data.value.cost_savings_summary);
  const moderateSavings = Object.values(data.value.cost_savings_summary).map(
    (item) => item.total_moderate_annual_savings_billion_rp
  );
  const maximumSavings = Object.values(data.value.cost_savings_summary).map(
    (item) => item.total_maximum_annual_savings_billion_rp
  );

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: tariffTypes,
      datasets: [
        {
          label: "Moderate Scenario",
          data: moderateSavings,
          backgroundColor: "#AB47BC",
          borderRadius: 4,
        },
        {
          label: "Maximum Scenario",
          data: maximumSavings,
          backgroundColor: "#7E57C2",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Annual Savings (Billion IDR)",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
};

onMounted(() => {
  setTimeout(() => {
    createSuitabilityChart();
    createCapacityChart();
    createSavingsChart();
  }, 100);
});

useHead({
  title: "Solar Panel Analysis Dashboard",
  meta: [
    {
      name: "description",
      content:
        "Comprehensive solar panel analysis dashboard showing building suitability and cost savings",
    },
  ],
});
</script>

<style scoped>
.v-card {
  @apply shadow-md;
}

.v-card:hover {
  @apply shadow-xl;
}

.gradient-text {
  background: linear-gradient(45deg, #42a5f5, #66bb6a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
