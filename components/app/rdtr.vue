<template>
  <div>
    <!-- Header -->
    <div
      class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200"
    >
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-semibold text-gray-900">
          Hasil Evaluasi RDTR: {{ data.itbx }}
        </h2>
        <v-icon :color="getStatusClass(data.itbx)" size="small">
          {{ getStatusIcon(data.itbx) }}
        </v-icon>
      </div>

      <span
        class="py-1 rounded-full text-sm font-medium"
        :class="getStatusClass(data.itbx)"
      >
        {{ getStatusText(data.itbx) }}
      </span>
    </div>
    <div class="mb-6">
      <h3 class="text-h6 font-weight-medium mb-3 d-flex align-center">
        <v-icon left>mdi-chart-box-outline</v-icon>
        Ringkasan
      </h3>

      <v-list flat class="border rounded">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Total Objek RDTR</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <span class="text-h6 font-weight-bold">{{ data.rdtr.length }}</span>
          </v-list-item-action>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Total Luas</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <span class="text-h6 font-weight-bold"
              >{{ totalLuasIntersect.toFixed(2) }} m²</span
            >
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>

    <!-- Objects Grid -->
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        Intersection Bidang dengan RDTR
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
        <div
          v-for="(item, index) in data.rdtr"
          :key="index"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <!-- Card Header -->
          <div class="flex justify-between items-start mb-3">
            <h4 class="text-base font-semibold text-gray-900 flex-1 pr-2">
              {{ item.namaObj }}
            </h4>
            <span class="text-xl">{{ getObjectTypeIcon(item.namaObj) }}</span>
          </div>

          <!-- Card Details -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Luas Intersect:</span>
              <span class="font-medium"
                >{{ item.luasintersect.toFixed(2) }} m²</span
              >
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Persentase:</span>
              <span class="font-medium"
                >{{ getPercentage(item.luasintersect) }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showGeometryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">
            Geometri - {{ selectedObject?.namaObj }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 max-h-96 overflow-y-auto">
          <pre
            class="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto"
            >{{
              JSON.stringify(selectedObject?.intersectgeometry, null, 2)
            }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GeometryCoordinate {
  type: string;
  coordinates: number[][][];
}

interface RDTRItem {
  namaObj: string;
  luasintersect: number;
  intersectgeometry: GeometryCoordinate;
}

interface RDTREvaluation {
  itbx: string;
  rdtr: RDTRItem[];
}

const props = defineProps<{
  data: RDTREvaluation;
}>();

const showGeometryModal = ref(false);
const selectedObject = ref<RDTRItem | null>(null);

const totalLuasIntersect = computed(() => {
  return props.data.rdtr.reduce((total, item) => total + item.luasintersect, 0);
});

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    I: "green",
    T: "amber",
    TB: "orange",
    B: "blue",
    X: "red",
  };
  return statusMap[status] || "bg-gray-100 text-gray-800";
};
const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    I: "mdi-check-circle", // Informasi
    T: "mdi-check-circle", // Berhasil
    TB: "mdi-alert", // Peringatan
    B: "mdi-alert-circle", // Butuh perbaikan / Belum lengkap
    X: "mdi-close-circle", // Error
  };
  return iconMap[status] || "mdi-help-circle";
};
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    I: "Intensitas Tinggi (lahan boleh dibangun, padat pemanfaatan)",
    T: "Terbatas (lahan boleh dibangun tapi dengan pembatasan tertentu)",
    TB: "Terbatas Bersyarat (boleh dibangun dengan pembatasan ketat + syarat tambahan)",
    B: "Boleh dengan syarat (conditional use, perlu kajian atau izin khusus)",
    X: "Dilarang (lahan tidak boleh dibangun untuk fungsi tertentu)",
  };
  return statusMap[status] || "Unknown";
};

const getObjectTypeIcon = (namaObj: string) => {
  if (namaObj.toLowerCase().includes("jalan")) return "🛣️";
  if (namaObj.toLowerCase().includes("perumahan")) return "🏘️";
  if (namaObj.toLowerCase().includes("komersial")) return "🏢";
  if (namaObj.toLowerCase().includes("industri")) return "🏭";
  return "📍";
};

const getPercentage = (luas: number) => {
  return ((luas / totalLuasIntersect.value) * 100).toFixed(1);
};

const showGeometry = (item: RDTRItem) => {
  selectedObject.value = item;
  showGeometryModal.value = true;
};

const showDetails = (item: RDTRItem) => {
  console.log("Show details for:", item);
};

const closeModal = () => {
  showGeometryModal.value = false;
  selectedObject.value = null;
};
</script>
