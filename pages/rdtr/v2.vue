<template>
  <div class="map-container">
    <h1>Evaluasi Bidang Tanah terhadap RDTR</h1>

    <!-- Panel Kontrol -->
    <div class="control-panel">
      <div class="control-group">
        <label>
          <input
            type="checkbox"
            v-model="showRDTR"
            @change="toggleLayer('rdtr')"
          />
          Tampilkan RDTR
        </label>
        <label>
          <input
            type="checkbox"
            v-model="showBidangTanah"
            @change="toggleLayer('bidang-tanah')"
          />
          Tampilkan Bidang Tanah
        </label>
      </div>

      <div class="info-section">
        <h4>Instruksi:</h4>
        <p>🖱️ Klik pada bidang tanah untuk evaluasi</p>
        <p>📊 Hasil evaluasi akan muncul di popup</p>
      </div>

      <button @click="resetAllEvaluations" class="btn-reset">
        Reset Semua Evaluasi
      </button>
    </div>

    <!-- Panel Status -->
    <div class="status-panel">
      <h4>Status Evaluasi</h4>
      <div class="legend">
        <div class="legend-item">
          <div class="color-box default"></div>
          <span>Belum dievaluasi</span>
        </div>
        <div class="legend-item">
          <div class="color-box success"></div>
          <span>Dalam RDTR</span>
        </div>
        <div class="legend-item">
          <div class="color-box warning"></div>
          <span>Di luar RDTR</span>
        </div>
        <div class="legend-item">
          <div class="color-box partial"></div>
          <span>Sebagian dalam RDTR</span>
        </div>
      </div>

      <div v-if="evaluatedCount > 0" class="stats">
        <p>
          <strong>Dievaluasi:</strong> {{ evaluatedCount }} dari
          {{ totalParcels }}
        </p>
      </div>
    </div>

    <div id="map" class="map"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from "vue";
import * as turf from "@turf/turf";

const map = ref(null);
const showRDTR = ref(true);
const showBidangTanah = ref(true);

let maplibregl = null;
let rdtrData = null;
let bidangTanahData = null;
let evaluatedParcels = new Set();

const totalParcels = computed(() => {
  return bidangTanahData ? bidangTanahData.features.length : 0;
});

const evaluatedCount = computed(() => {
  return evaluatedParcels.size;
});

onMounted(async () => {
  try {
    // Import MapLibre GL JS secara dinamis
    maplibregl = await import("maplibre-gl");

    // Inisialisasi map
    map.value = new maplibregl.Map({
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
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [106.8456, -6.2088],
      zoom: 12,
    });

    map.value.on("load", async () => {
      await loadLayers();
      setupClickInteractions();
    });
  } catch (error) {
    console.error("Error initializing map:", error);
  }
});

const loadLayers = async () => {
  try {
    // Load RDTR GeoJSON
    const rdtrResponse = await $fetch("/RDTR2023_AR.geojson");
    rdtrData = rdtrResponse;

    // Load Bidang Tanah GeoJSON
    const bidangTanahResponse = await $fetch("/persil_nib.geojson");
    bidangTanahData = bidangTanahResponse;

    // Add RDTR source dan layers
    map.value.addSource("rdtr", {
      type: "geojson",
      data: rdtrData,
    });

    map.value.addLayer({
      id: "rdtr-fill",
      type: "fill",
      source: "rdtr",
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.3,
      },
    });

    map.value.addLayer({
      id: "rdtr-line",
      type: "line",
      source: "rdtr",
      paint: {
        "line-color": "#088",
        "line-width": 2,
      },
    });

    // Add Bidang Tanah source dan layers
    map.value.addSource("bidang-tanah", {
      type: "geojson",
      data: bidangTanahData,
    });

    map.value.addLayer({
      id: "bidang-tanah-fill",
      type: "fill",
      source: "bidang-tanah",
      paint: {
        "fill-color": [
          "case",
          ["has", "evaluation_status"],
          [
            "case",
            ["==", ["get", "evaluation_status"], "fully_in_rdtr"],
            "#4CAF50", // Hijau - sepenuhnya dalam RDTR
            ["==", ["get", "evaluation_status"], "partially_in_rdtr"],
            "#FF9800", // Orange - sebagian dalam RDTR
            ["==", ["get", "evaluation_status"], "outside_rdtr"],
            "#f44336", // Merah - di luar RDTR
            "#2196F3", // Biru default
          ],
          "#2196F3", // Biru - belum dievaluasi
        ],
        "fill-opacity": 0.7,
      },
    });

    map.value.addLayer({
      id: "bidang-tanah-line",
      type: "line",
      source: "bidang-tanah",
      paint: {
        "line-color": [
          "case",
          ["has", "evaluation_status"],
          [
            "case",
            ["==", ["get", "evaluation_status"], "fully_in_rdtr"],
            "#2E7D32",
            ["==", ["get", "evaluation_status"], "partially_in_rdtr"],
            "#F57C00",
            ["==", ["get", "evaluation_status"], "outside_rdtr"],
            "#c62828",
            "#1976D2",
          ],
          "#1976D2",
        ],
        "line-width": ["case", ["has", "evaluation_status"], 3, 2],
      },
    });

    // Fit bounds to show all data
    fitBoundsToData();
  } catch (error) {
    console.error("Error loading layers:", error);
  }
};

const setupClickInteractions = () => {
  if (!maplibregl) return;

  // Click pada bidang tanah - EVALUASI TERJADI DI SINI
  map.value.on("click", "bidang-tanah-fill", (e) => {
    const feature = e.features[0];
    const parcelId = getParcelId(feature);

    // Lakukan evaluasi
    const evaluationResult = evaluateParcel(feature);
    console.log(evaluationResult);
    // Tambahkan ke set yang sudah dievaluasi
    evaluatedParcels.add(parcelId);

    // Update visual
    updateParcelVisualization(feature, evaluationResult);

    // Tampilkan popup dengan hasil evaluasi
    showEvaluationPopup(e.lngLat, feature, evaluationResult);
  });

  // Click pada RDTR untuk info
  map.value.on("click", "rdtr-fill", (e) => {
    const feature = e.features[0];
    showRDTRPopup(e.lngLat, feature);
  });

  // Hover effects
  map.value.on("mouseenter", "bidang-tanah-fill", () => {
    map.value.getCanvas().style.cursor = "pointer";
  });

  map.value.on("mouseleave", "bidang-tanah-fill", () => {
    map.value.getCanvas().style.cursor = "";
  });

  // Hover untuk RDTR
  map.value.on("mouseenter", "rdtr-fill", () => {
    map.value.getCanvas().style.cursor = "help";
  });

  map.value.on("mouseleave", "rdtr-fill", () => {
    map.value.getCanvas().style.cursor = "";
  });
};

const getParcelId = (feature) => {
  return (
    feature.properties?.id ||
    feature.properties?.ID ||
    feature.properties?.objectid ||
    JSON.stringify(feature.geometry.coordinates[0][0])
  ); // fallback
};

const evaluateParcel = (parcelFeature) => {
  const intersectingZones = [];
  const parcelArea = turf.area(parcelFeature);
  let totalIntersectionArea = 0;

  rdtrData.features.forEach((rdtrFeature, index) => {
    try {
      const intersection = turf.intersect(parcelFeature, rdtrFeature);
      if (intersection) {
        const intersectionArea = turf.area(intersection);
        totalIntersectionArea += intersectionArea;
        const coverage = (intersectionArea / parcelArea) * 100;

        intersectingZones.push({
          id: index,
          properties: rdtrFeature.properties,
          name:
            rdtrFeature.properties?.ZONA ||
            rdtrFeature.properties?.nama ||
            rdtrFeature.properties?.name ||
            `RDTR ${index + 1}`,
          coverage: coverage,
          area: intersectionArea,
          geometry: intersection.geometry,
        });
      }
    } catch (error) {
      //   console.warn(
      //     "Error calculating intersection for RDTR feature:",
      //     index,
      //     error
      //   );
    }
  });

  // Tentukan status evaluasi
  let evaluationStatus = "outside_rdtr";
  const totalCoverage = (totalIntersectionArea / parcelArea) * 100;

  if (totalCoverage >= 95) {
    evaluationStatus = "fully_in_rdtr";
  } else if (totalCoverage > 5) {
    evaluationStatus = "partially_in_rdtr";
  }

  return {
    status: evaluationStatus,
    zones: intersectingZones,
    totalCoverage: totalCoverage,
    parcelArea: parcelArea,
    intersectionArea: totalIntersectionArea,
  };
};

const updateParcelVisualization = (parcelFeature, evaluationResult) => {
  const parcelId = getParcelId(parcelFeature);

  // Update properties dari feature
  const updatedFeature = {
    ...parcelFeature,
    properties: {
      ...parcelFeature.properties,
      evaluation_status: evaluationResult.status,
      rdtr_zones: evaluationResult.zones,
      total_coverage: evaluationResult.totalCoverage,
      evaluated_at: new Date().toISOString(),
    },
  };

  // Update bidang tanah data
  const featureIndex = bidangTanahData.features.findIndex(
    (f) => getParcelId(f) === parcelId
  );

  if (featureIndex !== -1) {
    bidangTanahData.features[featureIndex] = updatedFeature;
    map.value.getSource("bidang-tanah").setData(bidangTanahData);
  }
};

const showEvaluationPopup = (lngLat, feature, evaluationResult) => {
  if (!maplibregl) return;

  const properties = feature.properties;

  let statusText = "";
  let statusClass = "";

  switch (evaluationResult.status) {
    case "fully_in_rdtr":
      statusText = "✅ Sepenuhnya dalam RDTR";
      statusClass = "status-success";
      break;
    case "partially_in_rdtr":
      statusText = "⚠️ Sebagian dalam RDTR";
      statusClass = "status-warning";
      break;
    case "outside_rdtr":
      statusText = "❌ Di luar RDTR";
      statusClass = "status-error";
      break;
  }

  let popupContent = `
    <div class="evaluation-popup">
      <h4>📋 Hasil Evaluasi Bidang Tanah</h4>
      <div class="parcel-info">
        <p><strong>ID:</strong> ${properties.id || properties.ID || "N/A"}</p>
        <p><strong>Nama:</strong> ${
          properties.nama || properties.name || "N/A"
        }</p>
        <p><strong>Luas:</strong> ${(
          evaluationResult.parcelArea / 10000
        ).toFixed(2)} Ha</p>
      </div>
      
      <div class="evaluation-result">
        <div class="status ${statusClass}">${statusText}</div>
        <p><strong>Coverage RDTR:</strong> ${evaluationResult.totalCoverage.toFixed(
          1
        )}%</p>
      </div>
  `;

  if (evaluationResult.zones.length > 0) {
    popupContent +=
      '<div class="zones-info"><h5>📍 Zona RDTR yang Bersinggungan:</h5><ul>';
    evaluationResult.zones.forEach((zone) => {
      popupContent += `
        <li>
          <strong>${zone.name}</strong><br>
          <small>Coverage: ${zone.coverage.toFixed(1)}% (${(
        zone.area / 10000
      ).toFixed(3)} Ha)</small>
        </li>
      `;
    });
    popupContent += "</ul></div>";
  }

  popupContent += `
      <div class="evaluation-time">
        <small>📅 Dievaluasi: ${new Date().toLocaleString("id-ID")}</small>
      </div>
    </div>
  `;

  new maplibregl.Popup({ maxWidth: "400px" })
    .setLngLat(lngLat)
    .setHTML(popupContent)
    .addTo(map.value);
};

const showRDTRPopup = (lngLat, feature) => {
  if (!maplibregl) return;

  const properties = feature.properties;

  let popupContent = '<div class="rdtr-popup"><h4>🗺️ Informasi RDTR</h4>';
  Object.keys(properties).forEach((key) => {
    if (properties[key] !== null && properties[key] !== undefined) {
      popupContent += `<p><strong>${key}:</strong> ${properties[key]}</p>`;
    }
  });
  popupContent += "</div>";

  new maplibregl.Popup()
    .setLngLat(lngLat)
    .setHTML(popupContent)
    .addTo(map.value);
};

const resetAllEvaluations = () => {
  evaluatedParcels.clear();

  // Reset properties dari semua bidang tanah
  bidangTanahData.features.forEach((feature) => {
    delete feature.properties.evaluation_status;
    delete feature.properties.rdtr_zones;
    delete feature.properties.total_coverage;
    delete feature.properties.evaluated_at;
  });

  // Update source
  map.value.getSource("bidang-tanah").setData(bidangTanahData);

  console.log("Semua evaluasi telah direset");
};

const toggleLayer = (layerType) => {
  const visibility =
    layerType === "rdtr"
      ? showRDTR.value
        ? "visible"
        : "none"
      : showBidangTanah.value
      ? "visible"
      : "none";

  if (layerType === "rdtr") {
    map.value.setLayoutProperty("rdtr-fill", "visibility", visibility);
    map.value.setLayoutProperty("rdtr-line", "visibility", visibility);
  } else {
    map.value.setLayoutProperty("bidang-tanah-fill", "visibility", visibility);
    map.value.setLayoutProperty("bidang-tanah-line", "visibility", visibility);
  }
};

const fitBoundsToData = () => {
  if (!maplibregl) return;

  const bounds = new maplibregl.LngLatBounds();

  // Extend bounds untuk semua data
  const allFeatures = [...rdtrData.features, ...bidangTanahData.features];

  allFeatures.forEach((feature) => {
    const bbox = turf.bbox(feature);
    bounds.extend([bbox[0], bbox[1]]);
    bounds.extend([bbox[2], bbox[3]]);
  });

  map.value.fitBounds(bounds, { padding: 50 });
};

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100%;
  position: relative;
}

h1 {
  text-align: center;
  margin: 20px 0;
  color: #333;
}

.control-panel {
  position: absolute;
  top: 80px;
  left: 10px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 250px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
}

.info-section {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.info-section h4 {
  margin: 0 0 8px 0;
  color: #495057;
}

.info-section p {
  margin: 4px 0;
  font-size: 13px;
  color: #6c757d;
}

.btn-reset {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #6c757d;
  color: white;
}

.btn-reset:hover {
  background: #5a6268;
}

.status-panel {
  position: absolute;
  top: 80px;
  right: 10px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
}

.status-panel h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.legend {
  margin-bottom: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.color-box {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 2px;
  border: 1px solid #ddd;
}

.color-box.default {
  background: #2196f3;
}
.color-box.success {
  background: #4caf50;
}
.color-box.warning {
  background: #ff9800;
}
.color-box.partial {
  background: #ff9800;
}

.stats {
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stats p {
  margin: 0;
  font-size: 14px;
}

.map {
  height: calc(100vh - 80px);
  width: 100%;
}

/* Popup Styles */
:deep(.evaluation-popup) {
  max-width: 380px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

:deep(.evaluation-popup h4) {
  margin: 0 0 12px 0;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

:deep(.parcel-info) {
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

:deep(.parcel-info p) {
  margin: 4px 0;
  font-size: 14px;
}

:deep(.evaluation-result) {
  margin-bottom: 12px;
}

:deep(.status) {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.status-success) {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

:deep(.status-warning) {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

:deep(.status-error) {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

:deep(.zones-info) {
  margin-bottom: 12px;
}

:deep(.zones-info h5) {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 14px;
}

:deep(.zones-info ul) {
  margin: 0;
  padding-left: 16px;
}

:deep(.zones-info li) {
  margin-bottom: 8px;
  font-size: 13px;
}

:deep(.evaluation-time) {
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

:deep(.rdtr-popup h4) {
  margin: 0 0 10px 0;
  color: #333;
}

:deep(.rdtr-popup p) {
  margin: 5px 0;
  font-size: 14px;
}
</style>
