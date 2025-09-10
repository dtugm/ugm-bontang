<template>
  <v-container fluid class="pa-0" style="height: 93vh">
    <v-row no-gutters style="height: 100%">
      <!-- Map Container -->
      <v-col cols="9" style="height: 100%">
        <div id="map" style="height: 100%; width: 100%"></div>
      </v-col>

      <!-- Sidebar untuk Feature Info -->
      <v-col cols="3" style="height: 100%; overflow-y: auto">
        <!-- Layer Control -->
        <v-card class="ma-2 mt-0" elevation="2">
          <v-card-title class="text-h6">
            <v-icon left>mdi-layers</v-icon>
            Kontrol Layer
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="showPbfLayer"
              @change="togglePbfLayer"
              label="Layer PBF"
              color="blue"
              density="compact"
            ></v-switch>

            <v-switch
              v-model="showGeoJsonLayer"
              @change="toggleGeoJsonLayer"
              label="Layer GeoJSON"
              color="green"
              density="compact"
            ></v-switch>
          </v-card-text>
        </v-card>
        <v-card class="ma-2" elevation="2">
          <v-card-title class="text-h6">
            <v-icon left>mdi-information</v-icon>
            Informasi Persil
          </v-card-title>

          <v-card-text v-if="!selectedFeature">
            <v-alert type="info" variant="outlined">
              Klik pada persil di peta untuk melihat informasi
            </v-alert>
          </v-card-text>

          <v-card-text v-if="selectedFeature">
            <v-chip
              :color="selectedFeature.source === 'pbf' ? 'blue' : 'green'"
              class="mb-3"
              size="small"
            >
              {{
                selectedFeature.source === "pbf" ? "Data PBF" : "Data GeoJSON"
              }}
            </v-chip>

            <v-list density="compact">
              <v-list-item
                v-for="(value, key) in selectedFeature.properties"
                :key="key"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-icon size="small">mdi-tag</v-icon>
                </template>
                <v-list-item-title class="text-caption font-weight-bold">
                  {{ key }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ value }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <!-- Geometry Info -->
            <v-divider class="my-3"></v-divider>
            <v-list-subheader class="px-0">Informasi Geometri</v-list-subheader>
            <v-list density="compact">
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-vector-polygon</v-icon>
                </template>
                <v-list-item-title class="text-caption font-weight-bold">
                  Tipe Geometri
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ selectedFeature.geometry.type }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title class="text-caption font-weight-bold">
                  Koordinat (Sample)
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ getCoordinatesSample() }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <!-- Reset Button -->
            <v-btn
              @click="resetSelection"
              color="warning"
              variant="outlined"
              size="small"
              class="mt-3"
              block
            >
              <v-icon left>mdi-refresh</v-icon>
              Reset Pilihan
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import rdtrConstant from "~/app/constant/rdtr.constant";
const rdtrGeojsonPath = "/RDTR2023_AR.geojson";
const bidangGeoJsonPath = "/PBG_BONTANGBARU.geojson";

const selectedFeature = ref(null);
const showPbfLayer = ref(true);
const showGeoJsonLayer = ref(true);
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

  //   // Click handler for PBF layers
  //   map.on("click", "pbf-fill", (e) => {
  //     handleFeatureClick(e, "pbf");
  //   });
  //   map.on("mouseenter", "pbf-fill", () => {
  //     map.getCanvas().style.cursor = "pointer";
  //   });

  //   map.on("mouseleave", "pbf-fill", () => {
  //     map.getCanvas().style.cursor = "";
  //   });
};

// Handle feature click
const handleFeatureClick = (e, sourceType) => {
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
