<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh"></div>
</template>

<script setup lang="ts">
const { $Cesium } = useNuxtApp();

onMounted(async () => {
  const viewer = new $Cesium.Viewer("cesiumContainer", {
    terrainProvider: await $Cesium.createWorldTerrainAsync(),

    baseLayerPicker: false, // Hide the default baseLayer picker
  });

  // Tambahkan OSM 3D Buildings
  const osmBuildings = await $Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(osmBuildings);
  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new $Cesium.OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
    })
  );
  // Fly to Jakarta
  viewer.camera.flyTo({
    destination: $Cesium.Cartesian3.fromDegrees(
      106.816666, // longitude
      -6.2, // latitude
      3000.0
    ),
    orientation: {
      heading: $Cesium.Math.toRadians(0.0),
      pitch: $Cesium.Math.toRadians(-30.0),
      roll: 0.0,
    },
    duration: 3,
  });
});
</script>
