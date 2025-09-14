<template>
  <v-card class="mx-auto" max-width="800" elevation="4">
    <!-- Header Card -->
    <v-card-title
      class="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <v-icon left class="mr-2">mdi-solar-panel</v-icon>
      Solar Analysis Report - RT {{ data.RT }}
    </v-card-title>

    <!-- Content -->
    <v-card-text class="pa-0">
      <!-- Search/Filter -->
      <div class="p-4 border-b" v-if="showSearch">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search properties..."
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </div>

      <!-- Data Grid -->
      <div class="max-h-screen overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-1">
          <div
            v-for="(value, key) in displayedData"
            :key="key"
            class="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <!-- Label -->
            <div class="flex-1 pr-4">
              <span class="text-sm font-medium text-gray-700">
                {{ formatLabel(key) }}
              </span>
            </div>

            <!-- Value -->
            <div class="flex-1 text-right">
              <v-chip
                :color="getChipColor(key, value)"
                variant="tonal"
                size="small"
                class="font-mono"
              >
                {{ formatValue(key, value) }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="Object.keys(displayedData).length === 0"
        class="p-8 text-center"
      >
        <v-icon size="64" color="grey-lighten-2" class="mb-4"
          >mdi-database-search</v-icon
        >
        <p class="text-grey-darken-1">No data to display</p>
      </div>
    </v-card-text>

    <!-- Footer with Summary -->
    <v-card-actions class="bg-gray-50 px-4 py-3" v-if="showSummary">
      <div class="w-full">
        <div
          class="flex justify-between items-center mb-2"
          v-if="data.suitability_class"
        >
          <span class="text-sm text-gray-600">Suitability Class:</span>
          <v-chip
            :color="getSuitabilityColor(data.suitability_class)"
            variant="elevated"
            size="small"
          >
            {{ data.suitability_class }}
          </v-chip>
        </div>
        <div
          class="flex justify-between items-center"
          v-if="data.solar_access_percent"
        >
          <span class="text-sm text-gray-600">Solar Access:</span>
          <span class="font-semibold text-green-600"
            >{{ data.solar_access_percent }}%</span
          >
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";

// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  keys: {
    type: Array,
    default: () => null,
    validator: (value) => {
      return (
        value === null ||
        (Array.isArray(value) && value.every((key) => typeof key === "string"))
      );
    },
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showSummary: {
    type: Boolean,
    default: true,
  },
});

// Reactive data
const searchQuery = ref("");

// String helper untuk title case
const stringHelper = {
  titleCase: (str) => {
    return str
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  },
};

// Computed properties
const filteredByKeys = computed(() => {
  // Jika keys tidak didefinisikan, tampilkan semua data
  if (!props.keys || props.keys.length === 0) {
    return props.data;
  }

  // Filter data berdasarkan keys yang ditentukan
  const filtered = {};
  props.keys.forEach((key) => {
    if (key in props.data) {
      filtered[key] = props.data[key];
    }
  });

  return filtered;
});

const displayedData = computed(() => {
  const baseData = filteredByKeys.value;

  // Jika tidak ada search query, return data yang sudah difilter berdasarkan keys
  if (!searchQuery.value) return baseData;

  // Filter berdasarkan search query
  const query = searchQuery.value.toLowerCase();
  const filtered = {};

  Object.entries(baseData).forEach(([key, value]) => {
    const label = stringHelper.titleCase(key).toLowerCase();
    const valueStr = String(value).toLowerCase();

    if (label.includes(query) || valueStr.includes(query)) {
      filtered[key] = value;
    }
  });

  return filtered;
});

// Methods
const formatLabel = (key) => {
  return stringHelper.titleCase(key);
};

const formatValue = (key, value) => {
  if (value === null || value === undefined) return "N/A";

  // Format berdasarkan tipe data dan key
  if (typeof value === "number") {
    // Percentage values
    if (key.includes("percent") || key.includes("fraction")) {
      return `${value.toFixed(2)}%`;
    }
    // Currency values (Rupiah)
    if (key.includes("rp") || key.includes("savings") || key.includes("cost")) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    }
    // Area values
    if (key.includes("area") || key.includes("m2")) {
      return `${value.toFixed(2)} m²`;
    }
    // Energy values
    if (key.includes("kwh") || key.includes("energy")) {
      return `${value.toFixed(2)} kWh`;
    }
    // Power values
    if (key.includes("kw") && !key.includes("kwh")) {
      return `${value.toFixed(2)} kW`;
    }
    // Years
    if (key.includes("years")) {
      return `${value.toFixed(1)} years`;
    }
    // Angles
    if (key.includes("angle")) {
      return `${value.toFixed(2)}°`;
    }
    // Default number formatting
    return value.toFixed(2);
  }

  return String(value);
};

const getChipColor = (key, value) => {
  // Color coding berdasarkan jenis data
  if (key.includes("percent") || key.includes("fraction")) {
    if (value >= 80) return "success";
    if (value >= 60) return "warning";
    return "error";
  }

  if (key.includes("roi")) {
    if (value >= 5) return "success";
    if (value >= 3) return "warning";
    return "error";
  }

  if (key === "suitability_score") {
    if (value >= 0.7) return "success";
    if (value >= 0.5) return "warning";
    return "error";
  }

  return "primary";
};

const getSuitabilityColor = (suitabilityClass) => {
  switch (suitabilityClass?.toLowerCase()) {
    case "excellent":
      return "success";
    case "good":
      return "info";
    case "fair":
      return "warning";
    case "marginal":
      return "orange";
    case "poor":
      return "error";
    default:
      return "grey";
  }
};
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
