<template>
  <div id="map" style="height: 100vh; width: 100%"></div>
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
          : "rgba(0, 0, 0, 0)",
        fillOpacity: 1,
        color: "yellow",
        opacity: 1,
      }),
    }).addTo(map);
  });
});
</script>
