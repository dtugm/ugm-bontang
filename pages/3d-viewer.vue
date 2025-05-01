<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh"></div>
</template>

<script setup>
const { $Cesium } = useNuxtApp();
$Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YTM4NjcyYy1mMGZmLTRhZmEtYTMxMi01YjA0ZDg3MjFkOWUiLCJpZCI6MjQ5NTg3LCJpYXQiOjE3Mjk0OTM4NjV9.2npo1m66SFpIlNazINBopkMP66ANa-O0EOexw-oH9wQ";
onMounted(async () => {
  const viewer = new $Cesium.Viewer("cesiumContainer", {
    // terrainProvider: await $Cesium.createWorldTerrainAsync(),

    baseLayerPicker: false, // Hide the default baseLayer picker
  });
  const tileset = await $Cesium.Cesium3DTileset.fromIonAssetId(3349257); // Contoh: assetId 96188 = NYC 3D Buildings
  tileset.style = new $Cesium.Cesium3DTileStyle({
    color: "color('white')",
  });
  tileset.lightColor = new $Cesium.Cartesian3(3.0, 3.0, 3.0);
  viewer.scene.primitives.add(tileset);
  const handler = new $Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  let highlightedFeature = null; // Variabel untuk menyimpan fitur yang sedang di-hover
  let originalColor = null; // Variabel untuk menyimpan warna asli fitur
  handler.setInputAction(function (movement) {
    const feature = viewer.scene.pick(movement.endPosition);

    // Kembalikan warna fitur yang sebelumnya di-hover
    if (highlightedFeature !== null) {
      highlightedFeature.color = originalColor;
      highlightedFeature = null;
      originalColor = null;
    }

    if (feature instanceof $Cesium.Cesium3DTileFeature) {
      // Simpan fitur yang di-hover dan warna aslinya
      highlightedFeature = feature;
      originalColor = $Cesium.Color.clone(feature.color);

      // Ubah warna saat hover
      feature.color = $Cesium.Color.YELLOW;
    }
  }, $Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // Tambahkan OSM 3D Buildings
  // const osmBuildings = await $Cesium.createOsmBuildingsAsync();
  // viewer.scene.primitives.add(osmBuildings);
  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new $Cesium.OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
    })
  );
  viewer.imageryLayers.addImageryProvider(
    new $Cesium.UrlTemplateImageryProvider({
      url: "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{reverseY}.png",
      tilingScheme: new $Cesium.WebMercatorTilingScheme(),
      maximumLevel: 19,
    })
  );
  // Fly to Jakarta
  viewer.camera.flyTo({
    destination: $Cesium.Cartesian3.fromDegrees(
      117.49334139672735,
      0.1246374623826603,
      800.0
    ),
    orientation: {
      heading: $Cesium.Math.toRadians(0.0),
      pitch: $Cesium.Math.toRadians(-30.0),
      roll: 0.0,
    },
  });
});
</script>
