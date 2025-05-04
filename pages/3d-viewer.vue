<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh">
    <div
      style="
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;

        width: 700px;
      "
    >
      <div class="flex gap-2 items-start">
        <AppInputAutocomplete
          class="flex-1"
          v-model="selectedLod"
          :items="lodOptions"
          hide-details
          @update:model-value="onLodChange"
        ></AppInputAutocomplete>
        <AppInputAutocomplete
          class="flex-1"
          v-model="selectedKelurahan"
          :items="kelurahanOptions"
          hide-details
          @update:model-value="flyToLocation"
        ></AppInputAutocomplete>
        <v-card class="px-5">
          <v-switch
            v-model="showXYZ"
            inset
            label="Ortho Photo"
            color="primary"
            class="flex-1"
            hide-details
          ></v-switch>
        </v-card>
      </div>
      <!-- <div class="flex gap-2 items-start">
        <v-btn @click="startSimulation">Simulasikan Matahari</v-btn>
        <v-btn @click="resetSimulation">Reset Matahari</v-btn>
      </div> -->
    </div>
  </div>
</template>

<script setup>
const { $Cesium } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
let viewer;
$Cesium.Ion.defaultAccessToken = runtimeConfig.public.CESIUM_TOKEN;
const AssetLod1 = [
  3353784, 3353785, 3353786, 3353787, 3353788, 3353791, 3353792, 3353794,
  3353795,
];
const AssetLod2 = [
  3349244, 3353797, 3353801, 3353802, 3353803, 3353804, 3353805, 3353806,
  2993843, 2993842, 2993815, 2993844,
];
const kelurahanName = [
  { nama: "API-API", lng: 117.490042, lat: 0.130865 },
  { nama: "BELIMBING", lng: 117.458959, lat: 0.153366 },
  { nama: "BERBAS PANTAI", lng: 117.484344, lat: 0.109969 },
  { nama: "BEREBAS TENGAH", lng: 117.479219, lat: 0.116115 },
  { nama: "BONTANG BARU", lng: 117.493761, lat: 0.144252 },
  { nama: "BONTANG KUALA", lng: 117.508149, lat: 0.133507 },
  { nama: "BONTANG LESTARI", lng: 117.442044, lat: 0.055355 },
  { nama: "SATIMPO", lng: 117.461529, lat: 0.10714 },
  { nama: "KANAAN", lng: 117.445876, lat: 0.123544 },
  { nama: "LOKTUAN", lng: 117.47457, lat: 0.164665 },
  { nama: "TANJUNG LAUT", lng: 117.485008, lat: 0.123059 },
  { nama: "GUNTUNG", lng: 117.487831, lat: 0.188374 },
  { nama: "GUNUNG ELAI", lng: 117.478848, lat: 0.143068 },
  { nama: "GUNUNG TELIHAN", lng: 117.452148, lat: 0.136698 },
  { nama: "TANJUNG LAUT INDAH", lng: 117.495981, lat: 0.117112 },
];
const AssetVegetasi = [3353813, 3353814];
const selectedLod = ref("lod1");
const selectedKelurahan = ref("Bontang Baru");
const lodOptions = ["lod1", "lod2"];
let awsTiles;
const showXYZ = ref(false);
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
  vegetasi: [],
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
    shadows: true,
    navigationInstructionsInitiallyVisible: false,
  });
  const customTime = $Cesium.JulianDate.fromDate(
    new Date("2025-05-04T01:00:00Z")
  );
  viewer.clock.currentTime = customTime;
  viewer.clock.shouldAnimate = false;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.shadows = true;
  const loadTileset = async (assetId) => {
    try {
      const tileset = await $Cesium.Cesium3DTileset.fromIonAssetId(assetId, {
        shadows: $Cesium.ShadowMode.ENABLED,
      });
      viewer.scene.primitives.add(tileset);
    } catch (error) {
      console.error(`Gagal memuat tileset dengan Asset ID ${assetId}:`, error);
    }
  };
  const loadTilesetV2 = async (assetId, lodLevel) => {
    try {
      const tileset = await $Cesium.Cesium3DTileset.fromIonAssetId(assetId, {
        shadows: $Cesium.ShadowMode.ENABLED,
      });
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
    ...AssetVegetasi.map(loadTileset),
  ]);
  const geojson = await $Cesium.GeoJsonDataSource.load("/3d/AREAALL.geojson", {
    stroke: $Cesium.Color.YELLOW,
    fill: $Cesium.Color.WHITE.withAlpha(0.1),
    strokeWidth: 3,
  });
  viewer.dataSources.add(geojson);
  kelurahanName.forEach((item) => {
    const posisi = $Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 100); // label agak melayang
    const posisiTanah = $Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 0); // titik di tanah
    viewer.entities.add({
      position: posisi,
      label: {
        text: item.nama,
        font: "20px sans-serif",
        fillColor: $Cesium.Color.BLACK,
        outlineColor: $Cesium.Color.WHITE,
        outlineWidth: 5,
        style: $Cesium.LabelStyle.FILL_AND_OUTLINE,
        // heightReference: $Cesium.HeightReference.CLAMP_TO_GROUND,
        verticalOrigin: $Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new $Cesium.Cartesian2(0, -10),
      },
    });
    viewer.entities.add({
      polyline: {
        positions: [posisi, posisiTanah],
        width: 2,
        material: $Cesium.Color.WHITE.withAlpha(1),
        clampToGround: false,
      },
    });
    viewer.entities.add({
      position: posisi,
      point: {
        pixelSize: 10,
        color: $Cesium.Color.RED,
        outlineColor: $Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: $Cesium.HeightReference.NONE,
      },
    });
  });
  // viewer.entities.add({
  //   position: $Cesium.Cartesian3.fromDegrees(117.4805, 0.1323), // Koordinat Bontang
  //   label: {
  //     text: "Bontang",
  //     font: "20px sans-serif",
  //     fillColor: $Cesium.Color.WHITE,
  //     outlineColor: $Cesium.Color.BLACK,
  //     outlineWidth: 2,
  //     style: $Cesium.LabelStyle.FILL_AND_OUTLINE,
  //     heightReference: $Cesium.HeightReference.CLAMP_TO_GROUND,
  //     verticalOrigin: $Cesium.VerticalOrigin.BOTTOM,
  //     pixelOffset: new $Cesium.Cartesian2(0, -10),
  //   },
  // });

  const handler = new $Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  let highlightedFeature = null;
  let originalColor = null;
  handler.setInputAction(function (movement) {
    const feature = viewer.scene.pick(movement.endPosition);
    if (highlightedFeature !== null) {
      highlightedFeature.color = originalColor;
      highlightedFeature = null;
      originalColor = null;
    }

    if (feature instanceof $Cesium.Cesium3DTileFeature) {
      highlightedFeature = feature;
      originalColor = $Cesium.Color.clone(feature.color);
      feature.color = $Cesium.Color.YELLOW;
    }
  }, $Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new $Cesium.OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
    })
  );

  awsTiles = await viewer.imageryLayers.addImageryProvider(
    new $Cesium.UrlTemplateImageryProvider({
      url: "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{reverseY}.png",
      tilingScheme: new $Cesium.WebMercatorTilingScheme(),
      maximumLevel: 19,
    })
  );
  awsTiles.show = showXYZ.value;

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
const startSimulation = () => {
  const start = $Cesium.JulianDate.fromDate(new Date("2025-05-04T22:00:00Z"));
  const stop = $Cesium.JulianDate.fromDate(new Date("2025-05-05T10:00:00Z"));

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = $Cesium.ClockRange.CLAMPED;
  viewer.clock.multiplier = 9000;
  viewer.clock.shouldAnimate = true;

  viewer.scene.globe.enableLighting = true;
  viewer.scene.shadows = true;
};
const resetSimulation = () => {
  const customTime = $Cesium.JulianDate.fromDate(
    new Date("2025-05-04T01:00:00Z")
  );
  viewer.clock.currentTime = customTime;
};
watch(showXYZ, (value) => {
  if (awsTiles) {
    awsTiles.show = value;
  }
});
</script>
