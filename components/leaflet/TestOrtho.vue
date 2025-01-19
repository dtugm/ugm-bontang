<template>
  <div id="map" style="height: 100vh"></div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // Inisialisasi Leaflet Map
  const map = L.map("map").setView([latitude, longitude], zoomLevel); // Ganti latitude, longitude, dan zoomLevel sesuai kebutuhan

  // Menambahkan XYZ Tile Layer dari AWS S3
  L.tileLayer(
    "https://{bucket-name}.s3.amazonaws.com/{path-to-tiles}/{z}/{x}/{y}.png",
    {
      maxZoom: 18, // Sesuaikan zoom maksimal dengan konfigurasi tile
      attribution: "© Your Attribution",
    }
  ).addTo(map);
});
</script>
