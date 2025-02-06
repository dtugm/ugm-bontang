<template>
  <div class="relative h-screen w-full">
    <!-- Map Container -->
    <div id="petaKerjaMap" class="h-full w-full z-0 pointer-events-auto"></div>

    <div class="absolute bottom-4 right-4 p-4 z-10 pointer-events-auto"></div>
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
  addGeoJson("/Pbb/BO_bontang.geojson", map, {
    style: (feature) => ({
      fillColor: "rgba(139, 146, 152, 1)",
      fillOpacity: 0.5,
      weight: 0.9,
      color: "white",
    }),
  });
});
</script>
