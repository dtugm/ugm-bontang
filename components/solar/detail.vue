<template>
  <v-card
    class="mx-auto overflow-y-auto"
    max-width="400"
    elevation="4"
    max-height="100vh"
  >
    <!-- Header Card -->
    <v-card-title
      class="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <v-icon left class="mr-2">mdi-solar-panel</v-icon>
      Solar Analysis Report
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

      <!-- Data Grid with Categories -->
      <div class="max-h-screen overflow-y-auto">
        <div
          v-for="(category, categoryName) in groupedData"
          :key="categoryName"
        >
          <!-- Category Header -->
          <div
            class="category-header bg-gray-100 px-4 py-3 border-b-2 border-gray-200"
          >
            <div class="flex items-center">
              <v-icon :color="getCategoryColor(categoryName)" class="mr-2">
                {{ getCategoryIcon(categoryName) }}
              </v-icon>
              <h3 class="text-lg font-semibold text-gray-800 capitalize">
                {{ getCategoryTitle(categoryName) }}
              </h3>
              <v-chip
                :color="getCategoryColor(categoryName)"
                variant="tonal"
                size="small"
                class="ml-2"
              >
                {{ Object.keys(category).length }} items
              </v-chip>
            </div>
          </div>

          <!-- Category Items -->
          <div class="category-items">
            <div
              v-for="(value, key) in category"
              :key="key"
              class="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors pl-8"
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

// Category mapping
const categoryMapping = {
  suitability: ["suitability_class", "suitability_score"],
  safety: ["safety_level", "safety_description"],
  potential: [
    "installed_capacity_maximum_kw",
    "energy_potential_maximum_kwh_year",
  ],
  saving: [
    "R1_1300_maximum_net_annual_savings_rp",
    "R1_900_maximum_net_annual_savings_rp",
    "R2_maximum_net_annual_savings_rp",
  ],
};

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
  if (!props.keys || props.keys.length === 0) {
    return props.data;
  }

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

  if (!searchQuery.value) return baseData;

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

// Group data by categories
const groupedData = computed(() => {
  const data = displayedData.value;
  const grouped = {};

  // Initialize categories
  Object.keys(categoryMapping).forEach((category) => {
    grouped[category] = {};
  });
  grouped["more_information"] = {};

  // Categorize data
  Object.entries(data).forEach(([key, value]) => {
    let categorized = false;

    for (const [category, keys] of Object.entries(categoryMapping)) {
      if (keys.includes(key)) {
        grouped[category][key] = value;
        categorized = true;
        break;
      }
    }

    // If not in any specific category, put in "more_information"
    if (!categorized) {
      grouped["more_information"][key] = value;
    }
  });

  // Remove empty categories
  Object.keys(grouped).forEach((category) => {
    if (Object.keys(grouped[category]).length === 0) {
      delete grouped[category];
    }
  });

  return grouped;
});

// Methods
const formatLabel = (key) => {
  return stringHelper.titleCase(key);
};

const formatValue = (key, value) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "number") {
    if (key.includes("percent") || key.includes("fraction")) {
      return `${value.toFixed(2)}%`;
    }
    if (key.includes("rp") || key.includes("savings") || key.includes("cost")) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    }
    if (key.includes("area") || key.includes("m2")) {
      return `${value.toFixed(2)} m²`;
    }
    if (key.includes("kwh") || key.includes("energy")) {
      return `${value.toFixed(2)} kWh`;
    }
    if (key.includes("kw") && !key.includes("kwh")) {
      return `${value.toFixed(2)} kW`;
    }
    if (key.includes("years")) {
      return `${value.toFixed(1)} years`;
    }
    if (key.includes("angle")) {
      return `${value.toFixed(2)}°`;
    }
    return value.toFixed(2);
  }

  return String(value);
};

const getChipColor = (key, value) => {
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

// New methods for categories
const getCategoryTitle = (categoryName) => {
  const titles = {
    suitability: "Suitability Analysis",
    safety: "Safety Assessment",
    potential: "Energy Potential",
    saving: "Financial Savings",
    more_information: "More Information",
  };
  return titles[categoryName] || stringHelper.titleCase(categoryName);
};

const getCategoryColor = (categoryName) => {
  const colors = {
    suitability: "success",
    safety: "warning",
    potential: "info",
    saving: "green",
    more_information: "grey",
  };
  return colors[categoryName] || "primary";
};

const getCategoryIcon = (categoryName) => {
  const icons = {
    suitability: "mdi-check-circle",
    safety: "mdi-shield-check",
    potential: "mdi-lightning-bolt",
    saving: "mdi-currency-usd",
    more_information: "mdi-information",
  };
  return icons[categoryName] || "mdi-folder";
};
</script>

<style scoped>
.category-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.category-items {
  background: white;
}

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
