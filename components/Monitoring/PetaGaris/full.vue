<template>
  <div class="relative h-screen w-full">
    <!-- Map Container -->
    <div id="map" class="h-full w-full z-0 pointer-events-auto"></div>

    <div class="absolute bottom-4 right-4 p-4 z-10 pointer-events-auto">
      <DashboardPjProgressCardPetaGaris
        class="w-[calc(100vw-70px)] md:w-[300px]"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

import L from "leaflet";
const latitude = 0.12505772302512846;
const longitude = 117.48004699561473;
const zoomLevel = 13;
const tileLayerURL =
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const osm = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const petaGarisStore = usePetaGarisStore();
onMounted(async () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Elemen map tidak ditemukan");
    return;
  }
  const map = L.map("map").setView([latitude, longitude], zoomLevel);
  L.tileLayer(osm, {
    maxZoom: 18,
  }).addTo(map);
  const response = await fetch("/petagaris/AREA_PETA_GARIS.geojson");
  const area = await response.json();
  const responseGrid = await fetch("/petagaris/GRID_PETA_GARIS.geojson");
  const grid = await responseGrid.json();
  if (petaGarisStore.totalArray.length == 0) {
    petaGarisStore.queryAll().then(async () => {
      const gridGeoJson = L.geoJson(grid, {
        style: (feature) => ({
          fillColor: "green",
          fillOpacity: petaGarisStore?.totalArray.some(
            (item) =>
              item.GRID === feature?.properties?.GRID && // Pastikan GRID ada
              Number(item.bagi_18) === feature?.properties?.bagi_18 // Pastikan bagi_18 ada
          )
            ? 1
            : 1,
          color: "white",
          opacity: 1,
        }),
      }).addTo(map);
    });
  } else {
    L.geoJson(grid, {
      style: (feature) => ({
        fillColor: "green",
        fillOpacity: petaGarisStore?.totalArray.some(
          (item) =>
            item.GRID === feature?.properties?.GRID && // Pastikan GRID ada
            Number(item.bagi_18) === feature?.properties?.bagi_18 // Pastikan bagi_18 ada
        )
          ? 1
          : 1,
        color: "white",
        opacity: 1,
      }),
    }).addTo(map);
  }
});
const isMobile = ref(window.innerWidth < 768);

const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>
