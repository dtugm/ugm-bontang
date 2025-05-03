<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh">
    <div
      style="
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;

        width: 500px;
      "
    >
      <div class="flex gap-2">
        <AppInputAutocomplete
          class="flex-1"
          v-model="selectedLod"
          :items="lodOptions"
          @update:model-value="onLodChange"
        ></AppInputAutocomplete>
        <AppInputAutocomplete
          class="flex-1"
          v-model="selectedKelurahan"
          :items="kelurahanOptions"
          @update:model-value="flyToLocation"
        ></AppInputAutocomplete>
      </div>
      <!-- <label for="lodSelect">Level of Detail:</label>
      <select id="lodSelect" @change="updateLOD">
        <option value="32">Low</option>
        <option value="16" selected>Medium</option>
        <option value="8">High</option>
        <option value="4">Ultra</option>
      </select> -->
    </div>
  </div>
</template>

<script setup>
const { $Cesium } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
let viewer;
$Cesium.Ion.defaultAccessToken = runtimeConfig.public.CESIUM_TOKEN;
const AssetLod1 = [
  2993812, 2712762, 2993842, 2993815, 2993843, 2993844, 2993846, 3352168,
  3352055, 3352218, 3352219, 3352231,
];
const AssetLod2 = [3349244];
const selectedLod = ref("lod1");
const selectedKelurahan = ref("Bontang Baru");
const lodOptions = ["lod1", "lod2"];
const kelurahanOptions = [
  "Bontang Baru",
  "Api Api",
  "Loktuan",
  "Tanjung Laut",
  "Bontang Lestari",
  "Berbas Pantai",
];
const tilesets = {
  lod1: [],
  lod2: [],
};
const onLodChange = async (lodLevel) => {
  tilesets.lod1.forEach((ts) => (ts.show = lodLevel === "lod1"));
  tilesets.lod2.forEach((ts) => (ts.show = lodLevel === "lod2"));

  const visibleTilesets = tilesets[lodLevel];
  if (visibleTilesets.length > 0) {
    // viewer.flyTo(visibleTilesets[0], {
    //   duration: 2,
    // });
  }
};
const flyToLocation = (location) => {
  console.log("first");
  let destination;
  let orientation = {
    heading: $Cesium.Math.toRadians(0.0),
    pitch: $Cesium.Math.toRadians(-30.0),
    roll: 0.0,
  };

  if (location === "Bontang Baru") {
    destination = $Cesium.Cartesian3.fromDegrees(
      117.49334139672735,
      0.1246374623826603,
      800.0
    );
  } else if (location === "Loktuan") {
    destination = $Cesium.Cartesian3.fromDegrees(117.48013, 0.157522, 800.0);
  } else if (location === "Api Api") {
    destination = $Cesium.Cartesian3.fromDegrees(
      117.49004550111674,
      0.12041788138490674,
      800.0
    );
  } else if (location === "Berbas Pantai") {
    destination = $Cesium.Cartesian3.fromDegrees(
      117.4874831480381,
      0.09857396385541731,
      800.0
    );
  } else if (location === "Tanjung Laut") {
    destination = $Cesium.Cartesian3.fromDegrees(
      117.48624290078145,
      0.10985577875862797,
      800.0
    );
  } else if (location === "Bontang Lestari") {
    destination = $Cesium.Cartesian3.fromDegrees(
      117.45896428849758,
      0.02983989641472985,
      300.0
    );
  }

  viewer.camera.flyTo({
    destination,
    orientation,
    duration: 3,
  });
};
onMounted(async () => {
  viewer = new $Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false,
    navigationInstructionsInitiallyVisible: false,
  });
  // const loadTileset = async (assetId) => {
  //   try {
  //     const tileset = await $Cesium.Cesium3DTileset.fromIonAssetId(assetId);
  //     tileset.style = new $Cesium.Cesium3DTileStyle({
  //       color: "color('white')",
  //     });
  //     viewer.scene.primitives.add(tileset);
  //   } catch (error) {
  //     console.error(`Gagal memuat tileset dengan Asset ID ${assetId}:`, error);
  //   }
  // };
  const loadTilesetV2 = async (assetId, lodLevel) => {
    try {
      const tileset = await $Cesium.Cesium3DTileset.fromIonAssetId(assetId);
      tileset.style = new $Cesium.Cesium3DTileStyle({
        color: "color('white')",
      });
      tileset.show = lodLevel === "lod1";
      viewer.scene.primitives.add(tileset);
      tilesets[lodLevel].push(tileset);
    } catch (error) {
      console.error(`Gagal memuat tileset dengan Asset ID ${assetId}:`, error);
    }
  };
  await Promise.all([
    ...AssetLod1.map((id) => loadTilesetV2(id, "lod1")),
    ...AssetLod2.map((id) => loadTilesetV2(id, "lod2")),
  ]);
  function switchLOD(level) {
    tilesets.lod1.forEach((ts) => (ts.show = level === "lod1"));
    tilesets.lod2.forEach((ts) => (ts.show = level === "lod2"));
  }
  const geojson = await $Cesium.GeoJsonDataSource.load("/3d/AREAALL.geojson", {
    stroke: $Cesium.Color.YELLOW,
    fill: $Cesium.Color.WHITE.withAlpha(0.1),
    strokeWidth: 3,
  });
  viewer.dataSources.add(geojson);

  // await Promise.all(AssetLod1.map(loadTileset));
  // const tileset = await $Cesium.Cesium3DTileset.fromIonAssetId(3349244);
  // tileset.style = new $Cesium.Cesium3DTileStyle({
  //   color: "color('white')",
  // });
  // viewer.scene.primitives.add(tileset);
  const handler = new $Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  let highlightedFeature = null;
  let originalColor = null;
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
