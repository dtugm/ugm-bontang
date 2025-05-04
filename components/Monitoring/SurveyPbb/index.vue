<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
const statusMap = SurveyLapanganConstant.statusMap;
const statusColorMap = SurveyLapanganConstant.statusColorMap;
const ownerTypeMap = SurveyLapanganConstant.ownerTypeMap;
const surveyStore = useSurveyStore();
const latitude = 0.139267;
const longitude = 117.494326;
const zoomLevel = 16;

const totalPolygons = ref(0);
const bangunanPolygon = ref(0);
const surveyedCount = ref(0);
const progress = ref(0);

onMounted(async () => {
  const map = L.map("map").setView([latitude, longitude], zoomLevel);
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
    }
  ).addTo(map);
  const awsTiles = L.tileLayer(
    "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{y}.png",
    {
      tms: true,
      minZoom: 12,
      maxZoom: 19,
    }
  ).addTo(map);

  // Fetch Data GeoJSON
  const geoJsonBontangBaru = await fetch(
    "/SurveyPbb/peta_kerja_bontang_baru.geojson"
  );
  const geoJsonBangunan = await fetch(
    "/SurveyPbb/building_bontang_baru_done.geojson"
  );
  const geoJsonBangunanRest = await fetch(
    "/SurveyPbb/building_bontang_baru_progress.geojson"
  );
  const bangunanApiApi = await fetch("/Pbb/BO_api_api.geojson");
  const bidangApiApi = await fetch("/Pbb/Bidang_api_api.geojson");

  const bidangBontangBaru = await geoJsonBontangBaru.json();
  const bangunanBontangBaru = await geoJsonBangunan.json();
  const bangunanBontangBaruProgress = await geoJsonBangunanRest.json();
  const bangunanApiApiProgress = await bangunanApiApi.json();
  const bidangApiApiProgress = await bidangApiApi.json();

  totalPolygons.value = bidangBontangBaru.features.length;

  await surveyStore.getAllUpdatedFeature();
  surveyedCount.value = surveyStore.bidangTanahData.length;
  progress.value = (surveyedCount.value / totalPolygons.value) * 100; // Kalkulasi progress

  // Fungsi Style GeoJSON
  const getStyle = (feature) => {
    const itemMap = new Map(
      surveyStore.bidangTanahData.map((item) => [item.fid, item])
    );
    const detailItem = itemMap.get(String(feature?.properties?.FID));
    let fillColor = "rgba(139, 146, 152, 1)";
    if (detailItem) {
      if (detailItem.ownerType === "GOVERNMENT_AREA") {
        fillColor = "#87CEEB";
      } else if (detailItem.ownerType === "PUBLIC_FACILITY") {
        fillColor = "#ffa6c8";
      } else {
        fillColor = statusColorMap[detailItem.status] || fillColor;
      }
    }
    return {
      fillColor: fillColor,
      weight: 1,
      color: "white",
      fillOpacity: detailItem ? 0.7 : 0.5,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 5, color: "yellow" }),
      mouseout: (e) => e.target.setStyle({ weight: 1, color: "white" }),
    });

    layer.on("click", () => {
      const itemMap = new Map(
        surveyStore.bidangTanahData.map((item) => [item.fid, item])
      );

      const detailItem = itemMap.get(String(feature.properties.FID));

      if (detailItem) {
        const popupContent = `
                <div style="font-family: Arial, sans-serif; width:400px max-width: 400px;">

            <p><strong>Provinsi:</strong> ${detailItem.province}</p>
                        <p><strong>Tipe Bidang Tanah:</strong> ${
                          ownerTypeMap[detailItem.ownerType]
                        }</p>
            <p><strong>Alamat OP:</strong> ${detailItem.taxObjectAddress}</p>
            <p><strong>Nama WP:</strong> ${detailItem.taxPayerName}</p>
            <p><strong>Status:</strong> <span style='color: ${
              statusColorMap[detailItem.status]
            };'>${statusMap[detailItem.status]}</span></p>
              <p><strong>Polygon ID  :</strong> ${detailItem.polygonId}</p>
              <img src="${detailItem.imageUrls}"
      style="max-width: 250px; height: auto; display: block; margin: 10px auto; border-radius: 5px;" />
              </div>
          `;
        layer.bindPopup(popupContent, { maxWidth: 700 }).openPopup();
      } else {
        layer
          .bindPopup(
            `
            <div style="font-family: Arial, sans-serif; width:400px max-width: 400px;">
              <p><strong>Status:</strong> <span style='color: red;'>Belum Disurvey</span></p>
              <p><strong>Polygon ID  :</strong> ${feature.properties.ID}</p>
            </div>
            `
          )
          .openPopup();
      }
    });
  };
  // Bangunan
  const getBangunanStyle = (feature) => {
    return {
      fillColor: "blue",
      weight: 1,
      color: "white",
      fillOpacity: 0.5,
    };
  };
  const getBangunanStyleProgress = (feature) => {
    return {
      fillColor: "rgba(139, 146, 152, 1)",
      weight: 1,
      color: "white",
      fillOpacity: 0.5,
    };
  };
  const onEachBangunanFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 5, color: "yellow" }),
      mouseout: (e) => e.target.setStyle({ weight: 1, color: "white" }),
    });
  };
  const geoJsonLayer = L.geoJSON(bidangBontangBaru, {
    style: getStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);

  const bangunanLayer = L.geoJSON(bangunanBontangBaru, {
    style: getBangunanStyle,
    onEachFeature: onEachBangunanFeature,
  }).addTo(map);
  const bangunanLayerProgress = L.geoJSON(bangunanBontangBaruProgress, {
    style: getBangunanStyleProgress,
    onEachFeature: onEachBangunanFeature,
  }).addTo(map);
  const ApiApiLayer = L.geoJSON(bangunanApiApiProgress, {
    style: getBangunanStyleProgress,
    onEachFeature: onEachBangunanFeature,
  }).addTo(map);
  const BidangApiApiLayer = L.geoJSON(bidangApiApiProgress, {
    style: getBangunanStyleProgress,
    onEachFeature: onEachBangunanFeature,
  }).addTo(map);

  const baseMaps = { OpenStreetMap: osm };

  const overlayMaps = {
    "AWS Tiles": awsTiles,
    "Bidang Bontang Baru": geoJsonLayer,
    "Bangunan Bontang Baru Terupdate": bangunanLayer,
    "Bangunan Bontang Baru Belum Terupdate": bangunanLayerProgress,
  };

  L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);
});

const legendVisible = ref(true);
const StatusSurvey = [
  { color: "#008000", title: "Sudah Tepat" },
  { color: "#FFD700", title: "Data Baru" },
  { color: "#FFA500", title: "Penggabungan Objek Pajak" },
  { color: "#FF8C00", title: "Pemecahan Objek Pajak" },
  { color: "#FF4500", title: "Delineasi" },
  { color: "#B22222", title: "Sengketa" },
  { color: "#FF8C00", title: "Pemilik Tidak Bisa Ditemui" },
  { color: "#FF4500", title: "Belum Disurvey" },
];
const kepemilikan = [
  { color: "#87CEEB", title: "Government Area " },
  { color: "#ffa6c8", title: "Fasilitas Umum" },
];
</script>

<template>
  <div class="map-container">
    <!-- Peta -->
    <div id="map" class="map"></div>

    <div class="progress-container">
      <v-card variant="flat" class="rounded-lg" width="400">
        <v-expansion-panels>
          <v-expansion-panel title="Status Survey">
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in StatusSurvey"
                  :key="index"
                  prepend-icon="mdi-exit-run"
                >
                  <template v-slot:prepend>
                    <v-avatar size="20" :color="item.color"></v-avatar>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels>
          <v-expansion-panel title="Penggunaan lahan">
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in kepemilikan"
                  :key="index"
                  prepend-icon="mdi-exit-run"
                >
                  <template v-slot:prepend>
                    <v-avatar size="20" :color="item.color"></v-avatar>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- <v-card-title class="pa-0">
          <v-btn
            icon
            variant="text"
            size="small"
            class="block"
            @click="legendVisible = !legendVisible"
          >
            <v-icon>{{
              legendVisible ? "mdi-chevron-down" : "mdi-chevron-up"
            }}</v-icon>
          </v-btn>
          Legenda
        </v-card-title>

        <v-expand-transition>
          <div v-show="legendVisible">
            <v-list>
              <v-list-item
                v-for="(item, index) in StatusSurvey"
                :key="index"
                prepend-icon="mdi-exit-run"
              >
                <template v-slot:prepend>
                  <v-avatar size="20" :color="item.color"></v-avatar>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-expand-transition> -->
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  height: 100%;
  width: 100%;
}

.progress-circle {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 5px;
  z-index: 999;
}

.progress-container {
  z-index: 999;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  text-align: start;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}

.progress-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
</style>
<!-- <div class="text-left mb-2">
  <p class="text-lg font-semibold">Progres Bontang Baru</p>
  <p class="">
    Selesai {{ surveyedCount }} dari
    {{ totalPolygons }}
  </p>
</div>
<v-progress-circular
  :model-value="progress"
  :size="140"
  :width="20"
  color="success"
>
  {{ Math.round(progress) }}%
</v-progress-circular> -->
