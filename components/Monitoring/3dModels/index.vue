<template>
  <div class="relative h-screen w-full">
    <!-- Map Container -->
    <div id="3dMap" class="h-full w-full z-0 pointer-events-auto"></div>

    <!-- Card -->
    <div class="absolute bottom-4 right-4 p-4 z-10 pointer-events-auto">
      <DashboardPjProgressCard3dModels
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
const osm =
  "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
async function addGeoJson(url, map, style) {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data, style).addTo(map);
    });
}
const geoJsonFiles = [
  "DoneArea",
  // "Apiapi",
  // "Loktuan",
  // "TanjungLaut",
  // "BerebasPantai",
  // "BO_BONLES",
  // "Blok_G",
  // "Blok_H",
  // "Blok_I",
  // "Blok_J",
  // "Blok_K",
  // "Blok_L",
  // "Blok_M",
];
onMounted(async () => {
  const mapElement = document.getElementById("3dMap");
  if (!mapElement) {
    console.error("Elemen map tidak ditemukan");
    return;
  }
  const map = L.map("3dMap").setView([latitude, longitude], zoomLevel);
  L.tileLayer(osm, {
    maxZoom: 18,
  }).addTo(map);
  await addGeoJson("/3d/AREAALL.geojson", map, {
    style: (feature) => ({
      fillColor: "rgba(139, 146, 152, 1)",
      fillOpacity: 0.5,
      color: "white",
    }),
  });
  addGeoJson("/new_bontang.geojson", map, {
    style: (feature) => ({ fillColor: "rgba(0, 0, 0, 0)", color: "yellow" }),
  });
  geoJsonFiles.forEach((blok) => {
    addGeoJson(`/3d/${blok}.geojson`, map, {
      style: (feature) => ({
        fillColor: "rgba(34, 139, 230, 1)",
        fillOpacity: 0.5,
        color: "rgba(34, 139, 230, 1)",
      }),
    });
  });

  // addGeoJson("/3d/Blok_N.geojson", map, {
  //   style: (feature) => ({
  //     fillColor: "rgba(34, 139, 230, 1)",
  //     fillOpacity: 1,
  //     color: "rgba(34, 139, 230, 1)",
  //   }),
  // });
});
</script>
