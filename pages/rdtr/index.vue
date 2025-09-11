<template>
  <v-container fluid class="pa-0" style="height: 93vh">
    <v-row no-gutters style="height: 100%">
      <!-- Map Container -->
      <v-col cols="8" style="height: 100%">
        <div id="map" style="height: 100%; width: 100%"></div>
      </v-col>

      <!-- Sidebar untuk Feature Info -->
      <v-col cols="4" style="height: 100%; overflow-y: auto" class="pa-2">
        <!-- Expansion Panels Container -->
        <v-expansion-panels
          v-model="expandedPanels"
          multiple
          variant="accordion"
          class="mb-4"
        >
          <!-- Panel 1: Informasi Bidang Tanah -->
          <v-expansion-panel
            value="landInfo"
            class="mb-2 rounded-lg shadow-sm"
            elevation="1"
          >
            <v-expansion-panel-title color="tertiary">
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="white">mdi-map-marker-outline</v-icon>
                </template>
                <v-list-item-title class="font-weight-bold text-2xl">
                  Informasi Bidang Tanah
                </v-list-item-title>
              </v-list-item>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <!-- No Selection State -->
              <div v-if="!selectedFeature" class="text-center py-8">
                <div
                  class="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                >
                  <v-icon size="48" color="gray-400" class="mb-3"
                    >mdi-map-search</v-icon
                  >
                  <p class="text-sm text-gray-600 mb-2">
                    Belum ada persil yang dipilih
                  </p>
                  <p class="text-xs text-gray-500">
                    Klik pada persil di peta untuk melihat informasi
                  </p>
                </div>
              </div>

              <!-- Selected Feature Data -->
              <div v-if="selectedFeature">
                <v-list density="compact">
                  <v-list-item
                    v-for="item in rdtrConstant.showedParcelAttribute"
                    :key="item.key"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold text-2xl">
                      {{ item.label }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-xl">
                      {{ selectedFeature.properties[item.key] }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Panel 2: Surat Keterangan PBG -->
          <v-expansion-panel
            value="pbgInfo"
            class="mb-2 rounded-lg shadow-sm"
            elevation="1"
          >
            <v-expansion-panel-title color="warning">
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="white">mdi-file-document-outline</v-icon>
                </template>
                <v-list-item-title class="font-weight-bold text-2xl">
                  Surat Keterangan PBG (Dummy)
                </v-list-item-title>
              </v-list-item>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <!-- No Selection State -->
              <div v-if="!selectedFeature" class="text-center py-8">
                <div
                  class="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                >
                  <v-icon size="48" color="gray-400" class="mb-3"
                    >mdi-file-search-outline</v-icon
                  >
                  <p class="text-sm text-gray-600 mb-2">
                    Data PBG tidak tersedia
                  </p>
                  <p class="text-xs text-gray-500">
                    Pilih persil terlebih dahulu
                  </p>
                </div>
              </div>

              <!-- PBG Data -->
              <div v-if="selectedFeature" class="space-y-3">
                <v-list density="compact">
                  <v-list-item
                    v-for="item in rdtrConstant.pbgAttribute"
                    :key="item.key"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold text-2xl">
                      {{ item.label }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-xl">
                      {{ selectedFeature.properties[item.key] }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <!-- Panel 2: Surat Keterangan PBG -->
          <v-expansion-panel
            value="rdtrInfo"
            class="mb-2 rounded-lg shadow-sm"
            elevation="1"
          >
            <v-expansion-panel-title>
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="green">mdi-file-document-outline</v-icon>
                </template>
                <v-list-item-title class="font-weight-bold text-2xl">
                  Evaluasi RDTR
                </v-list-item-title>
              </v-list-item>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <!-- No Selection State -->

              <div
                v-if="!evaluationData && !evaluationRdtrLoading"
                class="text-center py-8"
              >
                <div
                  class="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                >
                  <v-icon size="48" color="gray-400" class="mb-3"
                    >mdi-file-search-outline</v-icon
                  >
                  <p class="text-sm text-gray-600 mb-2">
                    Data PBG tidak tersedia
                  </p>
                  <p class="text-xs text-gray-500">
                    Pilih persil terlebih dahulu
                  </p>
                </div>
              </div>
              <div v-if="evaluationRdtrLoading" class="text-center py-8">
                <div
                  class="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
                >
                  <v-progress-circular indeterminate=""></v-progress-circular>
                </div>
              </div>

              <!-- PBG Data -->
              <div v-if="evaluationData && !evaluationRdtrLoading">
                <AppRdtr :data="evaluationData"></AppRdtr>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <v-btn
            @click="resetSelection"
            color="warning"
            variant="outlined"
            block
            class="rounded-md"
            :disabled="!selectedFeature"
          >
            <v-icon left size="16">mdi-refresh</v-icon>
            Reset Pilihan
          </v-btn>

          <!-- Additional Action Button (Optional) -->
          <!-- <v-btn
            v-if="selectedFeature"
            color="primary"
            variant="flat"
            size="small"
            block
            class="rounded-lg"
          >
            <v-icon left size="16">mdi-download</v-icon>
            Unduh Informasi
          </v-btn> -->
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import rdtrConstant from "~/app/constant/rdtr.constant";
import rdtrApi from "~/app/api/rdtr.api";
const rdtrGeojsonPath = "/RDTR2023_AR.geojson";
const bidangGeoJsonPath = "/PBG_BONTANGBARU.geojson";
const expandedPanels = ref([]);
const selectedFeature = ref(null);
const showPbfLayer = ref(true);
const showGeoJsonLayer = ref(true);
const evaluationRdtrLoading = ref(false);
let map = null;
let selectedFeatureId = null;
const initMap = () => {
  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm",
        },
      ],
    },
    center: [117.49379247354238, 0.1412850974858799],
    zoom: 15,
  });

  map.on("load", () => {
    setupLayers();
    setupClickHandlers();
  });
};

// Setup map layers
const setupLayers = async () => {
  const response_rdtr = await fetch(rdtrGeojsonPath);
  const geojson_rdtr = await response_rdtr.json();
  map.addSource("geojson-data-rdtr", {
    type: "geojson",
    data: geojson_rdtr,
  });
  const matchExpression = ["match", ["get", "NAMOBJ"]];
  Object.entries(rdtrConstant.colorSchemeRdtr).forEach(([key, value]) => {
    matchExpression.push(key, value);
  });
  matchExpression.push("#CCCCCC");
  console.log(matchExpression);
  map.addLayer({
    id: "geojson-fill",
    type: "fill",
    source: "geojson-data-rdtr",
    paint: {
      "fill-color": matchExpression,
      "fill-opacity": 0.3,
    },
  });
  map.addLayer({
    id: "geojson-stroke",
    type: "line",
    source: "geojson-data-rdtr",
    paint: {
      "line-color": "#555555",
      "line-width": 0.5,
      "line-opacity": 0.7,
    },
  });

  //   Tambah bidang tanah
  const bontang_baru_resp = await fetch(bidangGeoJsonPath);
  const bontang_baru = await bontang_baru_resp.json();
  map.addSource("bontang_baru", {
    type: "geojson",
    data: bontang_baru,
  });
  map.addLayer({
    id: "boba-fill",
    type: "fill",
    source: "bontang_baru",
    paint: {
      "fill-color": "#FFD600",
      "fill-opacity": 0.8,
    },
  });
  map.addLayer({
    id: "boba-stroke",
    type: "line",
    source: "bontang_baru",
    paint: {
      "line-color": "#333333",
      "line-width": 1,
    },
  });
};

const setupClickHandlers = () => {
  map.on("click", "boba-fill", (e) => {
    handleFeatureClick(e, "geojson");
  });

  // Change cursor on hover
  map.on("mouseenter", "boba-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "boba-fill", () => {
    map.getCanvas().style.cursor = "";
  });
};

// Handle feature click
const handleFeatureClick = async (e, sourceType) => {
  if (e.features.length > 0) {
    const feature = e.features[0];
    console.log(feature);

    // Reset previous selection
    resetSelection();

    // Set new selection
    selectedFeature.value = {
      properties: feature.properties,
      geometry: feature.geometry,
      source: sourceType,
    };

    selectedFeatureId = feature.properties.UUID;

    console.log(selectedFeatureId);
    // Update map styling for selected feature
    const layerId = sourceType === "geojson" ? "bontang_baru" : "pbf-data";

    // Remove and re-add selected layer with new source
    if (map.getLayer("selected-fill")) {
      map.removeLayer("selected-fill");
    }

    map.addLayer({
      id: "selected-fill",
      type: "fill",
      source: layerId,
      paint: {
        "fill-color": "#ef4444",
        "fill-opacity": 0.8,
      },
      filter: ["==", "UUID", selectedFeatureId],
    });
    zoomToSelected();
    evaluationRdtrLoading.value = true;
    await rdtrApi.get_intersect(selectedFeatureId).then((resp) => {
      evaluationData.value = resp;
    });
    evaluationRdtrLoading.value = false;
  }
};

// Reset selection
const resetSelection = () => {
  selectedFeature.value = null;
  selectedFeatureId = null;

  if (map && map.getLayer("selected-fill")) {
    map.setFilter("selected-fill", ["==", "id", ""]);
  }
};

// Toggle layer visibility
const togglePbfLayer = () => {
  const visibility = showPbfLayer.value ? "visible" : "none";
  map.setLayoutProperty("pbf-fill", "visibility", visibility);
  map.setLayoutProperty("pbf-stroke", "visibility", visibility);
};

const toggleGeoJsonLayer = () => {
  const visibility = showGeoJsonLayer.value ? "visible" : "none";
  map.setLayoutProperty("geojson-fill", "visibility", visibility);
  map.setLayoutProperty("geojson-stroke", "visibility", visibility);
};

// Get coordinates sample for display
const getCoordinatesSample = () => {
  if (!selectedFeature.value) return "";

  const coords = selectedFeature.value.geometry.coordinates;
  if (coords && coords[0] && coords[0][0]) {
    const sample = coords[0][0];
    return `[${sample[0].toFixed(6)}, ${sample[1].toFixed(6)}] ...`;
  }
  return "N/A";
};

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
const getFeatureCenter = (geometry) => {
  let coordinates;

  if (geometry.type === "Polygon") {
    coordinates = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    coordinates = geometry.coordinates[0][0];
  }

  // Calculate centroid
  let x = 0,
    y = 0;
  coordinates.forEach((coord) => {
    x += coord[0];
    y += coord[1];
  });

  return [x / coordinates.length, y / coordinates.length];
};
const zoomToSelected = () => {
  if (selectedFeature.value) {
    const center = getFeatureCenter(selectedFeature.value.geometry);
    map.easeTo({
      center: center,
      zoom: Math.max(map.getZoom(), 17),
      duration: 1500,
      essential: true,
    });
  }
};
const evaluationData = ref(null);
</script>

<style>
.maplibregl-popup {
  max-width: 300px;
}

.v-card {
  border-radius: 8px;
}

.text-caption {
  font-size: 0.75rem !important;
}
</style>
