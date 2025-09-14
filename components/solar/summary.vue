<template>
  <v-card
    class="solar-analysis-summary max-w-4xl mx-auto"
    elevation="8"
    rounded="sm"
  >
    <!-- Header -->
    <v-card-title
      class="bg-gradient-to-r from-blue-600 to-green-500 text-white py-4"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
          <v-icon size="32" class="mr-3">mdi-solar-panel-large</v-icon>
          <div>
            <h2 class="text-xl font-bold">Solar Panel Analysis Summary</h2>
            <p class="text-sm opacity-90">
              {{ formatDate() }}
            </p>
          </div>
        </div>
        <v-btn
          @click="$emit('close')"
          icon
          variant="text"
          color="white"
          size="small"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="p-0">
      <!-- Overview Stats -->
      <!-- <div class="grid grid-cols-2 md:grid-cols-2 gap-4 p-6 bg-gray-50">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ data.analysis_overview.total_buildings.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600">Total Buildings</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ data.analysis_overview.system_lifetime_years }}
          </div>
          <div class="text-sm text-gray-600">Years Lifetime</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">
            {{ data.analysis_overview.discount_rate_percent }}%
          </div>
          <div class="text-sm text-gray-600">Discount Rate</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">
            {{ data.analysis_overview.inflation_rate_percent }}%
          </div>
          <div class="text-sm text-gray-600">Inflation Rate</div>
        </div>
      </div> -->

      <!-- Suitability Breakdown Chart -->
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <v-icon class="mr-2" color="primary">mdi-chart-pie</v-icon>
          Building Suitability Distribution
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <!-- Pie Chart -->
          <div class="flex justify-center items-center">
            <canvas ref="pieChart" width="300" height="300"></canvas>
          </div>

          <!-- Suitability Details -->
          <div class="space-y-3">
            <div
              v-for="(category, key) in data.suitability_breakdown"
              :key="key"
              class="flex items-center justify-between p-3 rounded-lg border"
              :class="getSuitabilityClass(key)"
            >
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-full mr-3"
                  :style="{ backgroundColor: getSuitabilityColor(key) }"
                ></div>
                <div>
                  <div class="font-medium">{{ key }}</div>
                  <div class="text-sm text-gray-600">
                    {{ category.building_count.toLocaleString() }} buildings
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold">
                  {{
                    (
                      (category.building_count /
                        data.analysis_overview.total_buildings) *
                      100
                    ).toFixed(1)
                  }}%
                </div>
                <div class="text-sm text-gray-600">
                  {{ category.total_maximum_capacity_kw.toFixed(1) }} kW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tariff Comparison -->
      <div class="p-6 bg-gray-50">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <v-icon class="mr-2" color="success">mdi-currency-usd</v-icon>
          Cost Savings by Tariff Category
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div
            v-for="(tariff, key) in data.tariff_information"
            :key="key"
            class="bg-white rounded-lg p-4 shadow-sm border"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800">{{ key }}</h4>
              <v-chip size="small" color="primary">
                {{ formatCurrency(tariff.rate_per_kwh) }}/kWh
              </v-chip>
            </div>

            <p class="text-xs text-gray-600 mb-3">{{ tariff.description }}</p>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Annual Savings:</span>
                <span class="font-semibold text-green-600">
                  {{
                    formatBillionRupiah(
                      data.cost_savings_summary[key]
                        .total_maximum_annual_savings_billion_rp
                    )
                  }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Lifetime Savings:</span>
                <span class="font-semibold text-blue-600">
                  {{
                    formatBillionRupiah(
                      data.cost_savings_summary[key]
                        .total_maximum_lifetime_savings_billion_rp
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Best Performance Highlights -->
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <v-icon class="mr-2" color="warning">mdi-trophy</v-icon>
          Performance Highlights
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <!-- Best Savings -->
          <div
            class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
          >
            <div class="flex items-center mb-2">
              <v-icon color="green" class="mr-2">mdi-trending-up</v-icon>
              <h4 class="font-semibold text-green-800">
                Highest Savings Potential
              </h4>
            </div>
            <div class="text-2xl font-bold text-green-700 mb-1">
              {{
                formatBillionRupiah(
                  Math.max(
                    ...Object.values(data.cost_savings_summary).map(
                      (t) => t.total_maximum_lifetime_savings_billion_rp
                    )
                  )
                )
              }}
            </div>
            <p class="text-sm text-green-600">
              25-year lifetime savings (R2 tariff)
            </p>
          </div>

          <!-- Prime Buildings -->
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
          >
            <div class="flex items-center mb-2">
              <v-icon color="blue" class="mr-2">mdi-star</v-icon>
              <h4 class="font-semibold text-blue-800">Prime Locations</h4>
            </div>
            <div class="text-2xl font-bold text-blue-700 mb-1">
              {{ data.suitability_breakdown.Prime.building_count }}
            </div>
            <p class="text-sm text-blue-600">
              Buildings with optimal solar potential
              <br />
              <span class="font-medium"
                >{{
                  data.suitability_breakdown.Prime.total_maximum_capacity_kw.toFixed(
                    1
                  )
                }}
                kW capacity</span
              >
            </p>
          </div>
        </div>
      </div>

      <!-- ROI Information -->
      <div class="p-6 bg-blue-50">
        <h3 class="text-lg font-semibold mb-4 flex items-center text-blue-800">
          <v-icon class="mr-2" color="blue">mdi-calculator</v-icon>
          Return on Investment (ROI) Overview
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div class="text-center">
            <div class="text-lg font-bold text-blue-600">
              {{ getAverageROI("Prime").toFixed(2) }}%
            </div>
            <div class="text-sm text-gray-600">Prime Buildings ROI</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-green-600">
              {{ getAveragePayback("Prime").toFixed(1) }} years
            </div>
            <div class="text-sm text-gray-600">Average Payback Period</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-purple-600">
              {{ getTotalCapacity().toFixed(1) }} kW
            </div>
            <div class="text-sm text-gray-600">Total Solar Capacity</div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(["close", "downloadReport", "viewDetails"]);

// Refs
const pieChart = ref(null);

// Methods
const formatDate = () => {
  return new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatBillionRupiah = (amount) => {
  return `Rp ${amount.toFixed(2)}B`;
};

const getSuitabilityColor = (category) => {
  const colors = {
    Prime: "#2196F3",
    Suitable: "#66BB6A",
    Marginal: "#FFD54F",
    "Not Recommended": "#E53935",
  };
  return colors[category] || "#9E9E9E";
};

const getSuitabilityClass = (category) => {
  const classes = {
    Prime: "border-blue-200 bg-blue-50",
    Suitable: "border-green-300 bg-green-50", // mendekati #66BB6A
    Marginal: "border-yellow-200 bg-yellow-50", // mendekati #FFD54F
    "Not Recommended": "border-red-200 bg-red-50", // mendekati #E53935
  };
  return classes[category] || "border-gray-200 bg-gray-50";
};

const getAverageROI = (category) => {
  const categoryData = props.data.suitability_breakdown[category];
  if (!categoryData) return 0;

  // Get average ROI from R2 tariff (highest)
  return categoryData.tariff_savings.R2.maximum_scenario.average_roi_percent;
};

const getAveragePayback = (category) => {
  const categoryData = props.data.suitability_breakdown[category];
  if (!categoryData) return 0;

  // Get average payback from R2 tariff
  return categoryData.tariff_savings.R2.maximum_scenario.average_payback_years;
};

const getTotalCapacity = () => {
  return Object.values(props.data.suitability_breakdown).reduce(
    (total, category) => total + category.total_maximum_capacity_kw,
    0
  );
};

const createPieChart = () => {
  if (!pieChart.value) return;

  const ctx = pieChart.value.getContext("2d");
  const suitabilityData = props.data.suitability_breakdown;

  const labels = Object.keys(suitabilityData);
  const data = Object.values(suitabilityData).map(
    (category) => category.building_count
  );
  const colors = labels.map((label) => getSuitabilityColor(label));

  // Simple pie chart implementation
  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = -Math.PI / 2;

  // Adjust chart position to make room for legend
  const chartHeight = pieChart.value.height - 80; // Reserve space for legend
  const centerX = pieChart.value.width / 2;
  const centerY = chartHeight / 2;
  const radius = Math.min(centerX, centerY) - 20;

  ctx.clearRect(0, 0, pieChart.value.width, pieChart.value.height);

  // Draw pie chart
  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw percentage on slice
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${((value / total) * 100).toFixed(1)}%`, labelX, labelY);

    currentAngle += sliceAngle;
  });

  // Draw legend below the chart
  const legendY = chartHeight + 20;
  const legendItemWidth = pieChart.value.width / labels.length;

  labels.forEach((label, index) => {
    const legendX = index * legendItemWidth + legendItemWidth / 2;

    // Draw color box
    ctx.fillStyle = colors[index];
    ctx.fillRect(legendX - 30, legendY, 20, 15);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 30, legendY, 20, 15);

    // Draw label text
    ctx.fillStyle = "#000";
    ctx.font = "11px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, legendX - 5, legendY + 12);

    // Draw percentage
    const percentage = ((data[index] / total) * 100).toFixed(1);
    ctx.fillText(`(${percentage}%)`, legendX - 5, legendY + 25);
  });
};

const downloadReport = () => {
  emit("downloadReport");
};

const viewDetails = () => {
  emit("viewDetails");
};

// Lifecycle
onMounted(async () => {
  await nextTick();
  createPieChart();
});
</script>

<style scoped>
.solar-analysis-summary {
  max-height: 100vh;
  overflow-y: auto;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}
</style>
