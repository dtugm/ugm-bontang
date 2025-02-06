<!-- <template>
  <LMap
    ref="map"
    style="height: 100vh"
    :zoom="zoom"
    :center="[0.12505772302512846, 117.48004699561473]"
    :use-global-leaflet="false"
  >
    <LTileLayer
      url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      layer-type="base"
      name="OpenStreetMap"
    />
    <LGeoJson
      v-if="surveyStore.refreshPersil"
      :geojson="geojson"
      :options-style="geoStyler"
      :key="geojsonKey"
    />
  </LMap>
</template> -->
<template>
  <div class="relative h-screen w-full">
    <!-- Map Container -->
    <div id="petaKerjaMap" class="h-full w-full z-0 pointer-events-auto"></div>

    <div class="absolute bottom-4 right-4 p-4 z-10 pointer-events-auto">
      <DashboardPjProgressCardSurverPbb
        class="w-[calc(100vw-70px)] md:w-[300px]"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import L from "leaflet";
const latitude = 0.155452;
const longitude = 117.475476;
const zoomLevel = 15;
const osm = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
async function addGeoJson(url, map, style) {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data, style).addTo(map);
    });
}
const geoJsonFiles = ["peta_kerja_1", "peta_kerja_2", "peta_kerja_3"];
onMounted(async () => {
  const mapElement = document.getElementById("petaKerjaMap");
  if (!mapElement) {
    console.error("Elemen map tidak ditemukan");
    return;
  }
  const map = L.map("petaKerjaMap").setView([latitude, longitude], zoomLevel);
  L.tileLayer(osm, {
    maxZoom: 18,
  }).addTo(map);

  L.tileLayer(
    "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{y}.png",
    {
      tms: true,
      minZoom: 12,
      maxZoom: 19,
    }
  ).addTo(map);
  addGeoJson("/new_bontang.geojson", map, {
    style: (feature) => ({ fillColor: "rgba(0, 0, 0, 0)", color: "yellow" }),
  });
  geoJsonFiles.forEach((blok) => {
    addGeoJson(`/petaKerja/${blok}.geojson`, map, {
      style: (feature) => ({
        fillColor: "rgba(139, 146, 152, 1)",
        fillOpacity: 0.5,
        weight: 0.9,
        color: "white",
      }),
    });
  });
});
</script>

<!-- <script setup>
import { ref } from "vue";
import { collection, getFirestore } from "firebase/firestore";
const geojson = ref(undefined);
const batas = ref(undefined);
const zoom = ref(15);
const db = getFirestore();
const surveyStore = useSurveyStore();
const geoStyler = (feature) => ({
  fillColor: checkFeature(feature) ? "green" : "rgba(139, 146, 152, 1)",
  fillOpacity: checkFeature(feature) ? 1 : 0.5,
  color: "white",
  weight: 4,
});
const geojsonKey = ref(0);
const API_KEY = useRuntimeConfig().public.mapTilesKey;
onMounted(async () => {
  const response = await fetch("/Bontang_web.geojson");
  const batasBontang = await fetch("/new_bontang.geojson");
  geojson.value = await response.json();
  batas.value = await batasBontang.json();
});
const surveyProgress = useCollection(collection(db, "surveyProgress"));
function checkFeature(feature) {
  return surveyProgress.value.some(
    (item) => item.D_NOP === feature.properties.D_NOP && item.status === true
  );
}
</script> -->
