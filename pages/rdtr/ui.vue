<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b px-6 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            Evaluasi Bidang Tanah dengan RDTR
          </h1>
          <p class="text-sm text-gray-600">
            Sistem Evaluasi Kesesuaian Pemanfaatan Ruang
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="toggleRDTRLayer"
            :class="
              showRDTR ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {{ showRDTR ? "🗺️ Sembunyikan RDTR" : "🗺️ Tampilkan RDTR" }}
          </button>
          <button
            @click="toggleBidangLayer"
            :class="
              showBidang
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {{ showBidang ? "🏠 Sembunyikan Bidang" : "🏠 Tampilkan Bidang" }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 flex">
      <!-- Sidebar Panel -->
      <div class="w-80 bg-white shadow-lg border-r overflow-y-auto">
        <!-- Control Panel -->
        <div class="p-4 border-b bg-gray-50">
          <h3 class="font-semibold text-gray-800 mb-3">Panel Kontrol</h3>

          <!-- Layer Controls -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700"
                >Transparansi RDTR</label
              >
              <input
                v-model="rdtrOpacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-20"
                @input="updateRDTROpacity"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700"
                >Transparansi Bidang</label
              >
              <input
                v-model="bidangOpacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="w-20"
                @input="updateBidangOpacity"
              />
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="p-4 border-b">
          <h3 class="font-semibold text-gray-800 mb-3">Legenda RDTR</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-500 rounded"></div>
              <span>Perumahan (R)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Perdagangan & Jasa (K)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Perkantoran (KT)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Industri (I)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Campuran (C)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-500 rounded"></div>
              <span>RTH (RTH)</span>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="p-4 border-b">
          <h3 class="font-semibold text-gray-800 mb-3">Statistik</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Total Bidang:</span>
              <span class="font-medium">{{ totalBidang }}</span>
            </div>
            <div class="flex justify-between">
              <span>Bidang Sesuai:</span>
              <span class="font-medium text-green-600">{{ bidangSesuai }}</span>
            </div>
            <div class="flex justify-between">
              <span>Bidang Tidak Sesuai:</span>
              <span class="font-medium text-red-600">{{
                bidangTidakSesuai
              }}</span>
            </div>
            <div class="flex justify-between">
              <span>Perlu Evaluasi:</span>
              <span class="font-medium text-yellow-600">{{
                bidangPerluEvaluasi
              }}</span>
            </div>
          </div>
        </div>

        <!-- Selected Feature Info -->
        <div v-if="selectedFeature" class="p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Informasi Terpilih</h3>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-sm">
              <strong>Tipe:</strong> {{ selectedFeature.layer }}
            </p>
            <p class="text-sm">
              <strong>ID:</strong> {{ selectedFeature.properties.id }}
            </p>
            <div v-if="selectedFeature.layer === 'bidang'">
              <p class="text-sm">
                <strong>Pemilik:</strong>
                {{ selectedFeature.properties.pemilik }}
              </p>
              <p class="text-sm">
                <strong>Luas:</strong> {{ selectedFeature.properties.luas }} m²
              </p>
              <p class="text-sm">
                <strong>Penggunaan Saat Ini:</strong>
                {{ selectedFeature.properties.penggunaan_saat_ini }}
              </p>
            </div>
            <div v-if="selectedFeature.layer === 'rdtr'">
              <p class="text-sm">
                <strong>Zona:</strong> {{ selectedFeature.properties.zona }}
              </p>
              <p class="text-sm">
                <strong>Peruntukan:</strong>
                {{ selectedFeature.properties.peruntukan }}
              </p>
              <p class="text-sm">
                <strong>KDB:</strong> {{ selectedFeature.properties.kdb }}%
              </p>
              <p class="text-sm">
                <strong>KLB:</strong> {{ selectedFeature.properties.klb }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="flex-1 relative">
        <!-- Map -->
        <MglMap
          ref="mapRef"
          :map-style="mapStyle"
          :center="center"
          :zoom="zoom"
          @map:load="onMapLoad"
          class="w-full h-full"
        >
          <MglNavigationControl position="top-right" />
          <MglScaleControl position="bottom-left" />

          <!-- RDTR GeoJSON Source -->
          <MglGeoJsonSource source-id="rdtr-source" :data="rdtrData" />

          <!-- Bidang Tanah GeoJSON Source -->
          <MglGeoJsonSource source-id="bidang-source" :data="bidangData" />

          <!-- RDTR Layers -->
          <MglFillLayer
            v-if="showRDTR"
            layer-id="rdtr-fill"
            source-id="rdtr-source"
            :paint="{
              'fill-color': [
                'match',
                ['get', 'zona'],
                'R',
                '#22c55e',
                'K',
                '#3b82f6',
                'KT',
                '#8b5cf6',
                'I',
                '#f97316',
                'C',
                '#eab308',
                'RTH',
                '#6b7280',
                '#94a3b8',
              ],
              'fill-opacity': rdtrOpacity,
            }"
          />

          <MglLineLayer
            v-if="showRDTR"
            layer-id="rdtr-line"
            source-id="rdtr-source"
            :paint="{
              'line-color': '#ffffff',
              'line-width': 1,
              'line-opacity': 0.8,
            }"
          />

          <!-- Bidang Tanah Layers -->
          <MglFillLayer
            v-if="showBidang"
            layer-id="bidang-fill"
            source-id="bidang-source"
            :paint="{
              'fill-color': [
                'match',
                ['get', 'status_evaluasi'],
                'SESUAI',
                '#10b981',
                'TIDAK_SESUAI',
                '#ef4444',
                'PERLU_EVALUASI',
                '#f59e0b',
                '#6b7280',
              ],
              'fill-opacity': bidangOpacity,
            }"
          />

          <MglLineLayer
            v-if="showBidang"
            layer-id="bidang-line"
            source-id="bidang-source"
            :paint="{
              'line-color': '#1f2937',
              'line-width': 2,
              'line-opacity': 0.9,
            }"
          />

          <!-- Popup untuk menampilkan hasil evaluasi -->
          <MglPopup
            v-if="popupData.show"
            :coordinates="popupData.coordinates"
            :close-button="true"
            :close-on-click="true"
            @close="closePopup"
          >
            <div class="p-4 min-w-[400px] max-w-[500px]">
              <h3 class="font-bold text-lg mb-3 text-blue-600">
                {{ popupData.feature?.layer === "bidang" ? "🏠" : "🗺️" }}
                Hasil Evaluasi ITBX
              </h3>

              <div
                v-if="popupData.feature?.layer === 'bidang'"
                class="space-y-4"
              >
                <!-- Informasi Bidang -->
                <div class="bg-gray-50 p-3 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">
                    📋 Informasi Bidang
                  </h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>ID Bidang:</strong>
                      {{ popupData.feature.properties.id }}
                    </div>
                    <div>
                      <strong>Pemilik:</strong>
                      {{ popupData.feature.properties.pemilik }}
                    </div>
                    <div>
                      <strong>Luas:</strong>
                      {{ popupData.feature.properties.luas }} m²
                    </div>
                    <div>
                      <strong>Penggunaan:</strong>
                      {{ popupData.feature.properties.penggunaan_saat_ini }}
                    </div>
                  </div>
                </div>

                <!-- Informasi RDTR -->
                <div class="bg-blue-50 p-3 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">
                    🗺️ Informasi RDTR
                  </h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Zona:</strong>
                      {{ popupData.rdtrInfo?.zona || "Tidak teridentifikasi" }}
                    </div>
                    <div>
                      <strong>Peruntukan:</strong>
                      {{ popupData.rdtrInfo?.peruntukan || "N/A" }}
                    </div>
                    <div>
                      <strong>KDB:</strong>
                      {{ popupData.rdtrInfo?.kdb || "N/A" }}%
                    </div>
                    <div>
                      <strong>KLB:</strong>
                      {{ popupData.rdtrInfo?.klb || "N/A" }}
                    </div>
                  </div>
                </div>

                <!-- Hasil Evaluasi ITBX -->
                <div
                  :class="
                    getEvaluationBgColor(popupData.evaluationResult?.status)
                  "
                  class="p-3 rounded-lg"
                >
                  <h4 class="font-semibold text-gray-800 mb-2">
                    ⚖️ Hasil Evaluasi ITBX
                  </h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between items-center">
                      <strong>Status:</strong>
                      <span
                        :class="
                          getStatusTextColor(popupData.evaluationResult?.status)
                        "
                        class="font-bold"
                      >
                        {{ getStatusText(popupData.evaluationResult?.status) }}
                      </span>
                    </div>
                    <div>
                      <strong>Skor Kesesuaian:</strong>
                      {{ popupData.evaluationResult?.skor }}/100
                    </div>
                    <div>
                      <strong>Catatan:</strong>
                      {{ popupData.evaluationResult?.catatan }}
                    </div>

                    <!-- Detail Evaluasi -->
                    <div class="mt-3 pt-3 border-t border-gray-300">
                      <strong class="block mb-2">Detail Evaluasi:</strong>
                      <ul class="space-y-1 text-xs">
                        <li
                          v-for="detail in popupData.evaluationResult?.detail"
                          :key="detail.kriteria"
                        >
                          <span class="font-medium"
                            >{{ detail.kriteria }}:</span
                          >
                          <span
                            :class="
                              detail.sesuai ? 'text-green-600' : 'text-red-600'
                            "
                            class="ml-1"
                          >
                            {{ detail.sesuai ? "✓ Sesuai" : "✗ Tidak Sesuai" }}
                          </span>
                          <span class="text-gray-600 ml-1"
                            >({{ detail.keterangan }})</span
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Rekomendasi -->
                <div
                  v-if="popupData.evaluationResult?.rekomendasi"
                  class="bg-yellow-50 p-3 rounded-lg"
                >
                  <h4 class="font-semibold text-gray-800 mb-2">
                    💡 Rekomendasi
                  </h4>
                  <p class="text-sm">
                    {{ popupData.evaluationResult.rekomendasi }}
                  </p>
                </div>
              </div>

              <!-- Untuk RDTR -->
              <div
                v-else-if="popupData.feature?.layer === 'rdtr'"
                class="space-y-3"
              >
                <div class="bg-blue-50 p-3 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">
                    🗺️ Informasi Zona RDTR
                  </h4>
                  <div class="space-y-1 text-sm">
                    <div>
                      <strong>Zona:</strong>
                      {{ popupData.feature.properties.zona }}
                    </div>
                    <div>
                      <strong>Peruntukan:</strong>
                      {{ popupData.feature.properties.peruntukan }}
                    </div>
                    <div>
                      <strong>KDB Maksimal:</strong>
                      {{ popupData.feature.properties.kdb }}%
                    </div>
                    <div>
                      <strong>KLB Maksimal:</strong>
                      {{ popupData.feature.properties.klb }}
                    </div>
                    <div>
                      <strong>Ketinggian Maksimal:</strong>
                      {{ popupData.feature.properties.ketinggian_max }} lantai
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tombol Aksi -->
              <div class="flex gap-2 mt-4">
                <button
                  @click="generateReport"
                  class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex-1"
                >
                  📄 Generate Laporan
                </button>
                <button
                  @click="exportData"
                  class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex-1"
                >
                  📊 Export Data
                </button>
              </div>
            </div>
          </MglPopup>
        </MglMap>

        <!-- Loading Overlay -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
            ></div>
            <p class="text-gray-700">Memuat data evaluasi...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Map configuration
const mapStyle = {
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
};
const center = ref([106.8456, 0.1209]); // Jakarta
const zoom = ref(12);
const mapRef = ref(null);

// Data state
const rdtrData = ref(null);
const bidangData = ref(null);
const isLoadingData = ref(false);
const lastUpdated = ref("");
const loadingMessage = ref("Memuat data...");

// UI State
const showRDTR = ref(true);
const showBidang = ref(true);
const rdtrOpacity = ref(0.7);
const bidangOpacity = ref(0.8);
const isLoading = ref(false);
const selectedFeature = ref(null);

// Popup data
const popupData = ref({
  show: false,
  coordinates: [0, 0],
  feature: null,
  rdtrInfo: null,
  evaluationResult: null,
});

// Statistics
const totalBidang = computed(() => bidangData.value?.features?.length || 0);
const bidangSesuai = computed(
  () =>
    bidangData.value?.features?.filter(
      (f) => f.properties.status_evaluasi === "SESUAI"
    ).length || 0
);
const bidangTidakSesuai = computed(
  () =>
    bidangData.value?.features?.filter(
      (f) => f.properties.status_evaluasi === "TIDAK_SESUAI"
    ).length || 0
);
const bidangPerluEvaluasi = computed(
  () =>
    bidangData.value?.features?.filter(
      (f) => f.properties.status_evaluasi === "PERLU_EVALUASI"
    ).length || 0
);
const tingkatKesesuaian = computed(() => {
  if (totalBidang.value === 0) return 0;
  return Math.round((bidangSesuai.value / totalBidang.value) * 100);
});

let map = null;

// Load GeoJSON data from public folder
const loadGeoJSONData = async () => {
  isLoadingData.value = true;
  loadingMessage.value = "Memuat data GeoJSON...";

  try {
    // Load RDTR data
    loadingMessage.value = "Memuat data RDTR...";
    const rdtrResponse = await fetch("/RDTR2023_AR.geojson");
    if (!rdtrResponse.ok) {
      throw new Error(`Failed to load RDTR data: ${rdtrResponse.statusText}`);
    }
    rdtrData.value = await rdtrResponse.json();
    console.log(
      "RDTR data loaded:",
      rdtrData.value.features?.length,
      "features"
    );

    // Load Bidang Tanah data
    loadingMessage.value = "Memuat data bidang tanah...";
    const bidangResponse = await fetch("/bidang.geojson");
    if (!bidangResponse.ok) {
      throw new Error(
        `Failed to load Bidang data: ${bidangResponse.statusText}`
      );
    }
    bidangData.value = await bidangResponse.json();
    console.log(
      "Bidang data loaded:",
      bidangData.value.features?.length,
      "features"
    );

    // Update last updated time
    lastUpdated.value = new Date().toLocaleTimeString("id-ID");

    // Fit map to data bounds if available
    if (rdtrData.value?.features?.length > 0) {
      fitMapToBounds();
    }
  } catch (error) {
    console.error("Error loading GeoJSON data:", error);
    alert(
      `Error loading data: ${error.message}\n\nPastikan file GeoJSON tersedia di folder public/geojson/`
    );
  } finally {
    isLoadingData.value = false;
  }
};

const fitMapToBounds = () => {
  if (!map || !rdtrData.value?.features?.length) return;

  try {
    // Calculate bounds from all features
    let minLng = Infinity,
      minLat = Infinity;
    let maxLng = -Infinity,
      maxLat = -Infinity;

    const processFeatures = (features) => {
      features.forEach((feature) => {
        if (feature.geometry?.type === "Polygon") {
          feature.geometry.coordinates[0].forEach(([lng, lat]) => {
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
          });
        }
      });
    };

    processFeatures(rdtrData.value.features);
    if (bidangData.value?.features) {
      processFeatures(bidangData.value.features);
    }

    if (
      isFinite(minLng) &&
      isFinite(maxLng) &&
      isFinite(minLat) &&
      isFinite(maxLat)
    ) {
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 50,
          duration: 1000,
        }
      );
    }
  } catch (error) {
    console.error("Error fitting bounds:", error);
  }
};

const reloadData = async () => {
  await loadGeoJSONData();
};

const onMapLoad = () => {
  map = mapRef.value?.map;
  if (map) {
    console.log("Map loaded successfully");

    // Event listeners untuk layer interactions
    const layerIds = ["bidang-fill", "rdtr-fill"];

    layerIds.forEach((layerId) => {
      map.on("click", layerId, async (e) => {
        await onFeatureClick(e, layerId);
      });

      map.on("mouseenter", layerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }
};

const onFeatureClick = async (event, layerId) => {
  const feature = event.features[0];
  const { lng, lat } = event.lngLat;

  isLoading.value = true;
  loadingMessage.value = "Melakukan evaluasi ITBX...";

  try {
    // Determine layer type
    const layer = layerId.includes("bidang") ? "bidang" : "rdtr";

    // Set selected feature
    selectedFeature.value = {
      layer,
      properties: feature.properties,
    };

    let rdtrInfo = null;
    let evaluationResult = null;

    if (layer === "bidang") {
      // Find intersecting RDTR
      loadingMessage.value = "Mencari zona RDTR terkait...";
      rdtrInfo = await findIntersectingRDTR(feature.geometry, [lng, lat]);

      // Perform ITBX evaluation
      loadingMessage.value = "Melakukan evaluasi kesesuaian...";
      evaluationResult = await performITBXEvaluation(
        feature.properties,
        rdtrInfo
      );
    }

    popupData.value = {
      show: true,
      coordinates: [lng, lat],
      feature: { ...feature, layer },
      rdtrInfo,
      evaluationResult,
    };
  } catch (error) {
    console.error("Error processing feature click:", error);
    alert("Terjadi kesalahan saat melakukan evaluasi. Silakan coba lagi.");
  } finally {
    isLoading.value = false;
  }
};

const findIntersectingRDTR = async (bidangGeometry, clickPoint) => {
  // Simulate spatial intersection analysis
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!rdtrData.value?.features) return null;

  const rdtrFeatures = rdtrData.value.features;

  // Simple point-in-polygon check for demo
  for (const rdtrFeature of rdtrFeatures) {
    if (isPointInPolygon(clickPoint, rdtrFeature.geometry.coordinates[0])) {
      return rdtrFeature.properties;
    }
  }

  // Fallback: return closest RDTR (simplified)
  return rdtrFeatures[0]?.properties || null;
};

const isPointInPolygon = (point, polygon) => {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
};

const performITBXEvaluation = async (bidangProperties, rdtrInfo) => {
  // Simulate ITBX evaluation process
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!rdtrInfo) {
    return {
      status: "TIDAK_DAPAT_DIEVALUASI",
      skor: 0,
      catatan: "Tidak ditemukan informasi RDTR untuk lokasi ini",
      detail: [],
      rekomendasi: "Perlu verifikasi lokasi dan ketersediaan data RDTR",
    };
  }

  const evaluation = {
    status: "SESUAI",
    skor: 100,
    catatan: "",
    detail: [],
    rekomendasi: "",
    analisis_spasial: {
      overlap_percentage: 100,
      distance_to_boundary: 0,
    },
  };

  let totalSkor = 0;
  let maxSkor = 0;

  // 1. Evaluasi Kesesuaian Peruntukan
  maxSkor += 30;
  const peruntukan = evaluatePeruntukan(
    bidangProperties.penggunaan_saat_ini,
    rdtrInfo.zona
  );
  evaluation.detail.push(peruntukan);
  if (peruntukan.sesuai) totalSkor += 30;

  // 2. Evaluasi KDB (Koefisien Dasar Bangunan)
  maxSkor += 25;
  const kdb = evaluateKDB(bidangProperties.kdb_existing, rdtrInfo.kdb);
  evaluation.detail.push(kdb);
  if (kdb.sesuai) totalSkor += 25;

  // 3. Evaluasi KLB (Koefisien Lantai Bangunan)
  maxSkor += 25;
  const klb = evaluateKLB(bidangProperties.klb_existing, rdtrInfo.klb);
  evaluation.detail.push(klb);
  if (klb.sesuai) totalSkor += 25;

  // 4. Evaluasi Ketinggian Bangunan
  maxSkor += 20;
  const ketinggian = evaluateKetinggian(
    bidangProperties.jumlah_lantai,
    rdtrInfo.ketinggian_max
  );
  evaluation.detail.push(ketinggian);
  if (ketinggian.sesuai) totalSkor += 20;

  // Hitung skor final
  evaluation.skor = Math.round((totalSkor / maxSkor) * 100);

  // Tentukan status berdasarkan skor
  if (evaluation.skor >= 80) {
    evaluation.status = "SESUAI";
    evaluation.catatan = "Penggunaan lahan sesuai dengan ketentuan RDTR";
    evaluation.rekomendasi =
      "Penggunaan lahan dapat dilanjutkan sesuai rencana yang ada. Pastikan tetap mematuhi ketentuan teknis yang berlaku.";
  } else if (evaluation.skor >= 60) {
    evaluation.status = "PERLU_EVALUASI";
    evaluation.catatan =
      "Terdapat beberapa aspek yang perlu disesuaikan dengan ketentuan RDTR";
    evaluation.rekomendasi =
      "Diperlukan penyesuaian pada aspek yang tidak sesuai. Konsultasikan dengan dinas terkait untuk mendapatkan arahan lebih lanjut.";
  } else {
    evaluation.status = "TIDAK_SESUAI";
    evaluation.catatan = "Penggunaan lahan tidak sesuai dengan ketentuan RDTR";
    evaluation.rekomendasi =
      "Disarankan untuk mengubah penggunaan lahan atau mengajukan permohonan penyesuaian/perubahan zonasi kepada pemerintah daerah.";
  }

  return evaluation;
};

const evaluatePeruntukan = (penggunaanSaatIni, zonaRDTR) => {
  const kesesuaianMatrix = {
    R: ["Perumahan", "Rumah Tinggal", "Rumah"],
    K: ["Perdagangan", "Toko", "Ruko", "Mall", "Pasar", "Warung"],
    KT: ["Perkantoran", "Kantor"],
    I: [
      "Industri Kecil",
      "Industri Sedang",
      "Industri Ringan",
      "Gudang",
      "Industri",
    ],
    C: [
      "Perumahan",
      "Perdagangan",
      "Perkantoran",
      "Sekolah",
      "Rumah Sakit",
      "Campuran",
    ],
    RTH: ["Taman", "Hutan Kota", "Lapangan", "RTH"],
  };

  const penggunaanYangDiizinkan = kesesuaianMatrix[zonaRDTR] || [];
  const sesuai = penggunaanYangDiizinkan.some((p) =>
    penggunaanSaatIni.toLowerCase().includes(p.toLowerCase())
  );

  return {
    kriteria: "Kesesuaian Peruntukan",
    sesuai,
    nilai_existing: penggunaanSaatIni,
    nilai_rdtr: `Zona ${zonaRDTR}`,
    keterangan: sesuai
      ? `Penggunaan ${penggunaanSaatIni} sesuai dengan zona ${zonaRDTR}`
      : `Penggunaan ${penggunaanSaatIni} tidak sesuai dengan zona ${zonaRDTR}. Diizinkan: ${penggunaanYangDiizinkan.join(
          ", "
        )}`,
  };
};

const evaluateKDB = (kdbExisting, kdbMax) => {
  const sesuai = kdbExisting <= kdbMax;

  return {
    kriteria: "Koefisien Dasar Bangunan (KDB)",
    sesuai,
    nilai_existing: `${kdbExisting}%`,
    nilai_rdtr: `Maks ${kdbMax}%`,
    keterangan: sesuai
      ? `KDB ${kdbExisting}% sesuai dengan ketentuan maksimal ${kdbMax}%`
      : `KDB ${kdbExisting}% melebihi ketentuan maksimal ${kdbMax}%. Kelebihan: ${
          kdbExisting - kdbMax
        }%`,
  };
};

const evaluateKLB = (klbExisting, klbMax) => {
  const sesuai = klbExisting <= klbMax;

  return {
    kriteria: "Koefisien Lantai Bangunan (KLB)",
    sesuai,
    nilai_existing: klbExisting.toString(),
    nilai_rdtr: `Maks ${klbMax}`,
    keterangan: sesuai
      ? `KLB ${klbExisting} sesuai dengan ketentuan maksimal ${klbMax}`
      : `KLB ${klbExisting} melebihi ketentuan maksimal ${klbMax}. Kelebihan: ${(
          klbExisting - klbMax
        ).toFixed(1)}`,
  };
};

const evaluateKetinggian = (jumlahLantai, ketinggianMax) => {
  const sesuai = jumlahLantai <= ketinggianMax;

  return {
    kriteria: "Ketinggian Bangunan",
    sesuai,
    nilai_existing: `${jumlahLantai} lantai`,
    nilai_rdtr: `Maks ${ketinggianMax} lantai`,
    keterangan: sesuai
      ? `Ketinggian ${jumlahLantai} lantai sesuai dengan ketentuan maksimal ${ketinggianMax} lantai`
      : `Ketinggian ${jumlahLantai} lantai melebihi ketentuan maksimal ${ketinggianMax} lantai. Kelebihan: ${
          jumlahLantai - ketinggianMax
        } lantai`,
  };
};

const closePopup = () => {
  popupData.value.show = false;
  selectedFeature.value = null;
};

const toggleRDTRLayer = () => {
  showRDTR.value = !showRDTR.value;
};

const toggleBidangLayer = () => {
  showBidang.value = !showBidang.value;
};

const updateRDTROpacity = () => {
  if (map && map.getLayer("rdtr-fill")) {
    map.setPaintProperty("rdtr-fill", "fill-opacity", rdtrOpacity.value);
  }
};

const updateBidangOpacity = () => {
  if (map && map.getLayer("bidang-fill")) {
    map.setPaintProperty("bidang-fill", "fill-opacity", bidangOpacity.value);
  }
};

const getEvaluationBgColor = (status) => {
  switch (status) {
    case "SESUAI":
      return "bg-green-50";
    case "TIDAK_SESUAI":
      return "bg-red-50";
    case "PERLU_EVALUASI":
      return "bg-yellow-50";
    case "TIDAK_DAPAT_DIEVALUASI":
      return "bg-gray-50";
    default:
      return "bg-gray-50";
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case "SESUAI":
      return "text-green-600";
    case "TIDAK_SESUAI":
      return "text-red-600";
    case "PERLU_EVALUASI":
      return "text-yellow-600";
    case "TIDAK_DAPAT_DIEVALUASI":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "SESUAI":
      return "SESUAI";
    case "TIDAK_SESUAI":
      return "TIDAK SESUAI";
    case "PERLU_EVALUASI":
      return "PERLU EVALUASI";
    case "TIDAK_DAPAT_DIEVALUASI":
      return "TIDAK DAPAT DIEVALUASI";
    default:
      return "BELUM DIEVALUASI";
  }
};

const generateReport = async () => {
  if (!popupData.value.evaluationResult) return;

  const report = {
    timestamp: new Date().toISOString(),
    bidang_info: popupData.value.feature.properties,
    rdtr_info: popupData.value.rdtrInfo,
    evaluation_result: popupData.value.evaluationResult,
    coordinates: popupData.value.coordinates,
  };

  // Simulate report generation
  console.log("Generated Report:", report);

  // Create downloadable JSON file
  const dataStr = JSON.stringify(report, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `laporan_evaluasi_${report.bidang_info.id}_${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  alert("Laporan evaluasi berhasil dibuat dan diunduh!");
};

const exportData = async () => {
  const data = {
    bidang: popupData.value.feature?.properties,
    rdtr: popupData.value.rdtrInfo,
    evaluation: popupData.value.evaluationResult,
    coordinates: popupData.value.coordinates,
    timestamp: new Date().toISOString(),
  };

  try {
    const jsonString = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonString);
    alert("Data evaluasi berhasil disalin ke clipboard!");
  } catch (err) {
    console.error("Gagal export data:", err);
    // Fallback: download as file
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `export_data_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    alert("Data berhasil diunduh sebagai file JSON!");
  }
};

// Load data on component mount
onMounted(async () => {
  await loadGeoJSONData();
});

// Cleanup
onUnmounted(() => {
  if (map) {
    const layerIds = ["bidang-fill", "rdtr-fill"];
    layerIds.forEach((layerId) => {
      try {
        map.off("click", layerId);
        map.off("mouseenter", layerId);
        map.off("mouseleave", layerId);
      } catch (error) {
        console.warn("Error cleaning up event listeners:", error);
      }
    });
  }
});
</script>
