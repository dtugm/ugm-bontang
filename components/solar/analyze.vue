<template>
  <v-card class="max-w-md" elevation="4" rounded="lg">
    <v-card-title
      class="text-center py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white"
    >
      <v-icon left class="mr-2">mdi-solar-panel</v-icon>
      Solar Panel Analysis
    </v-card-title>

    <v-card-text class="p-6">
      <!-- Tombol Start Analysis -->
      <div v-if="!isAnalyzing" class="text-center pt-3">
        <v-btn
          @click="startAnalysis"
          color="tertiary"
          :loading="false"
          class="text-none"
        >
          <v-icon left>mdi-play-circle</v-icon>
          Analyzing Solar Panel Potential
        </v-btn>
        <p class="text-sm text-gray-600 mt-2">
          Click to start comprehensive solar panel analysis
        </p>
      </div>

      <!-- Progress Steps -->
      <div v-else class="space-y-4 pt-4">
        <!-- Step 1: Fetching Data -->
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <v-progress-circular
              v-if="currentStep >= 1 && currentStep < 2"
              indeterminate
              color="blue"
              size="24"
            />
            <v-icon v-else-if="currentStep >= 2" color="green" size="24">
              mdi-check-circle
            </v-icon>
            <v-icon v-else color="gray" size="24"> mdi-circle-outline </v-icon>
          </div>
          <div class="flex-1">
            <p
              class="font-medium"
              :class="currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'"
            >
              Fetching Data Iradiasi
            </p>
            <p class="text-xs text-gray-500">
              Collecting solar irradiation data from satellites
            </p>
          </div>
        </div>

        <!-- Step 2: Analyzing Data -->
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <v-progress-circular
              v-if="currentStep >= 2 && currentStep < 3"
              indeterminate
              color="orange"
              size="24"
            />
            <v-icon v-else-if="currentStep >= 3" color="green" size="24">
              mdi-check-circle
            </v-icon>
            <v-icon v-else color="gray" size="24"> mdi-circle-outline </v-icon>
          </div>
          <div class="flex-1">
            <p
              class="font-medium"
              :class="currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'"
            >
              Analyzing Data Iradiasi
            </p>
            <p class="text-xs text-gray-500">
              Processing and calculating optimal solar exposure
            </p>
          </div>
        </div>

        <!-- Step 3: Implementing to 3D Model -->
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <v-progress-circular
              v-if="currentStep >= 3 && currentStep < 4"
              indeterminate
              color="purple"
              size="24"
            />
            <v-icon v-else-if="currentStep >= 4" color="green" size="24">
              mdi-check-circle
            </v-icon>
            <v-icon v-else color="gray" size="24"> mdi-circle-outline </v-icon>
          </div>
          <div class="flex-1">
            <p
              class="font-medium"
              :class="currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'"
            >
              Implementing Data Iradiasi to 3D Model
            </p>
            <p class="text-xs text-gray-500">
              Applying analysis results to 3D visualization
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-6">
          <v-progress-linear
            :model-value="progressPercentage"
            color="primary"
            height="8"
            rounded
            class="mb-2"
          />
          <p class="text-center text-sm text-gray-600">
            {{ progressText }}
          </p>
        </div>

        <!-- Complete State -->
        <div v-if="currentStep >= 4" class="text-center mt-4">
          <v-icon color="green" size="48" class="mb-2">
            mdi-check-circle
          </v-icon>
          <p class="text-green-600 font-semibold">Analysis Complete!</p>
          <!-- <v-btn
            @click="resetAnalysis"
            color="primary"
            variant="outlined"
            class="mt-2 text-none"
            size="small"
          >
            Run New Analysis
          </v-btn> -->
          <v-btn
            @click="resetAnalysis"
            color="tertiary"
            variant="outlined"
            class="mt-2 text-none"
            size="small"
          >
            Open Summary
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const emit = defineEmits(["analyze", "finish", "reset"]);
// Reactive variables
const isAnalyzing = ref(false);
const currentStep = ref(0);

// Computed properties
const progressPercentage = computed(() => {
  return (currentStep.value / 4) * 100;
});

const progressText = computed(() => {
  switch (currentStep.value) {
    case 1:
      return "Fetching irradiation data... 25%";
    case 2:
      return "Analyzing solar potential... 50%";
    case 3:
      return "Generating 3D model... 75%";
    case 4:
      return "Analysis completed! 100%";
    default:
      return "Ready to start analysis";
  }
});

// Methods
const startAnalysis = async () => {
  emit("analyze");
  isAnalyzing.value = true;
  currentStep.value = 1;

  // Simulate step progression
  setTimeout(() => {
    currentStep.value = 2;
  }, 2000);

  setTimeout(() => {
    currentStep.value = 3;
  }, 4000);

  setTimeout(() => {
    currentStep.value = 4;
    emit("finish"); // dipindah ke sini supaya finish setelah step 4
    // isAnalyzing.value = false; // sekalian reset kalau perlu
  }, 6000);
};

const resetAnalysis = () => {
  emit("reset");
  isAnalyzing.value = false;
  currentStep.value = 0;
};

// Lifecycle
onMounted(() => {
  // Component mounted
});
</script>

<style scoped>
/* Additional custom styles if needed */
.v-card {
  @apply shadow-lg hover:shadow-xl transition-shadow duration-300;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-x-3 > * + * {
  margin-left: 0.75rem;
}
</style>
