<template>
  <div id="map" style="width: 100%; height: 500px"></div>
</template>

<script>
import L from "leaflet";
import "leaflet-mbtiles"; // Pustaka MBTiles

export default {
  mounted() {
    const map = L.map("map").setView([0, 0], 2);
    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // }).addTo(map);
    const key = "A8uDlPTkzTGVjXPyMalD";
    L.tileLayer(
      `https://api.maptiler.com/tiles/de87de13-5b83-4e8c-92fd-448138e0799f/{z}/{x}/{y}.png?key=${key}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);
  },
};
</script>
