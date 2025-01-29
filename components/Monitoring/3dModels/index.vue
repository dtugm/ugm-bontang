<template>
  <div class="relative w-full">
    <!-- Map Container -->
    <div id="map" class="h-full w-full z-0 pointer-events-auto"></div>

    <!-- Card -->
    <div class="absolute top-4 right-4 p-4 w-80 z-10 pointer-events-auto">
      <v-card>
        <v-card-title>Progress Peta Garis</v-card-title>
        <v-card-text>
          <v-progress-circular
            model-value="20"
            :size="128"
            :width="12"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <!-- <h2 class="text-lg font-semibold">Informasi Peta</h2>
      <p class="text-sm text-gray-600">
        Ini adalah deskripsi singkat tentang peta.
      </p>
      <button
        class="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Klik Saya
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import L from "leaflet";
const latitude = 0.12505772302512846;
const longitude = 117.48004699561473;
const zoomLevel = 13;
const tileLayerURL =
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const osm = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const areaColors = petaGarisConstant.areaColors;
const petaGarisStore = usePetaGarisStore();
onMounted(async () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Elemen map tidak ditemukan");
    return;
  }
  const map = L.map("map").setView([latitude, longitude], zoomLevel);
  L.tileLayer(tileLayerURL, {
    maxZoom: 18,
    attribution: "© Your Attribution",
  }).addTo(map);
  const response = await fetch("/AREA_PETA_GARIS.geojson");
  const area = await response.json();
  const responseGrid = await fetch("/GRID_PETA_GARIS.geojson");
  const grid = await responseGrid.json();
  petaGarisStore.queryAll().then(async () => {
    const gridGeoJson = L.geoJson(grid, {
      style: (feature) => ({
        fillColor: petaGarisStore?.totalArray.some(
          (item) =>
            item.GRID === feature?.properties?.GRID && // Pastikan GRID ada
            Number(item.bagi_18) === feature?.properties?.bagi_18 // Pastikan bagi_18 ada
        )
          ? "green"
          : "rgba(139, 146, 152, 1)",
        fillOpacity: petaGarisStore?.totalArray.some(
          (item) =>
            item.GRID === feature?.properties?.GRID && // Pastikan GRID ada
            Number(item.bagi_18) === feature?.properties?.bagi_18 // Pastikan bagi_18 ada
        )
          ? 1
          : 0.5,
        color: "white",
        opacity: 1,
      }),
    }).addTo(map);
  });
});
</script>
