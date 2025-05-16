<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh">
    <div
      style="position: absolute; bottom: 30px; right: 10px; z-index: 1"
      class="flex gap-3"
    >
      <v-card class="px-5">
        <v-switch
          v-model="showXYZ"
          inset
          label="Ortho Photo"
          color="primary"
          hide-details
        ></v-switch>
      </v-card>
      <v-card class="px-5">
        <v-switch
          v-model="showLod1"
          inset
          label="Bangunan"
          color="tertiary"
          hide-details
          @change="toggleTileset('lod1', showLod1)"
        />
      </v-card>

      <!-- Floating Popup -->
    </div>
    <v-card
      v-if="popupVisible"
      class="pa-3"
      style="
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10;
        width: 500px;
        height: 600px;
        overflow-y: auto;
      "
      elevation="10"
    >
      <div style="overflow-y: auto">
        <div class="d-flex justify-space-between align-center mb-2">
          <strong>Detail Object</strong>
          <v-btn icon size="small" @click="popupVisible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div v-if="!isLoadingDetail">
          <div>
            <div v-if="Object.keys(detail).length" class="h-[350px]">
              <v-img :src="detail.imageUrls[0]">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>
            <div v-else>Maaf Foto Tidak Tersedia</div>
            <div v-if="buildingDetail">
              <AppTableProps :title="defaultHead" :value="buildingDetail" />
            </div>
          </div>
          <!-- <div v-else>Tidak ada atribut tersedia untuk objek ini.</div> -->
        </div>
        <div v-else>
          <div class="d-flex align-center justify-center h-[350px]">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
            ></v-progress-circular>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import surveyApi from "~/app/api/survey.api";
import buildingSurveyApi from "../app/api/buildingSurvey.api";
import viewerConstant from "~/app/constant/viewer.constant.ts";
const defaultHead = ref({});
const buildingHead = {
  alamat: "Alamat",
  date: "Tanggal Update",
  tinggi: "Tinggi Bangunan",
  jlmh_lantai: "Jumlah Lantai",
  kelurahan: "Kelurahan",
  luas: "Luas Bangunan",
  lat: "Latitude",
  lon: "Longitude",
  nama_wp: "Nama Wajib Pajak",
  nik_wp: "NIK Wajib Pajak",
  nop: "NOP",
  rt: "RT",
  toponimi: "Toponimi",
};
const { $Cesium } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const popupVisible = ref(false);
const isLoadingDetail = ref(false);
let viewer;
$Cesium.Ion.defaultAccessToken = runtimeConfig.public.CESIUM_TOKEN;
const AssetLod1 = viewerConstant.BuildingAsset.demo;
const kelurahanName = viewerConstant.KelurahanCoordinate;
const AssetVegetasi = viewerConstant.BuildingAsset.vegetasi;
let awsTiles;
const showXYZ = ref(false);
const tilesets = {
  lod1: [],
  lod2: [],
  vegetasi: [],
};
const detail = ref({});
const buildingDetail = ref();
onMounted(async () => {
  viewer = new $Cesium.Viewer("cesiumContainer", {
    baseLayerPicker: false,
    navigationInstructionsInitiallyVisible: false,
  });
  viewer.infoBox.container.style.display = "none";
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
    ...AssetVegetasi.map(loadTileset),
  ]);
  const geojson = await $Cesium.GeoJsonDataSource.load("/3d/AREAALL.geojson", {
    stroke: $Cesium.Color.YELLOW,
    fill: $Cesium.Color.WHITE.withAlpha(0.1),
    strokeWidth: 3,
  });
  viewer.dataSources.add(geojson);
  const persil = await $Cesium.GeoJsonDataSource.load("/persil_nib.geojson", {
    stroke: $Cesium.Color.BLUE,
    fill: $Cesium.Color.YELLOW.withAlpha(0.7),
    strokeWidth: 3,
  });
  viewer.dataSources.add(persil);
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
      feature.color = $Cesium.Color.BLUE;
    }
  }, $Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(async function (movement) {
    const pickedFeature = viewer.scene.pick(movement.position);
    console.log(pickedFeature);
    if (
      $Cesium.defined(pickedFeature) &&
      pickedFeature instanceof $Cesium.Cesium3DTileFeature
    ) {
      popupVisible.value = true;
      isLoadingDetail.value = true;
      const fid = pickedFeature.getProperty("uuid_bgn");
      try {
        const resp = await buildingSurveyApi.get_building_by_fid(fid);
        detail.value = resp;
        isLoadingDetail.value = false;
      } catch (error) {
        detail.value = {};
        isLoadingDetail.value = false;
      }
      const data = {
        alamat: pickedFeature.getProperty("ALAMAT_BGN"),
        date: pickedFeature.getProperty("DATE_UPDT"),
        tinggi: pickedFeature.getProperty("Height"),
        jlmh_lantai: pickedFeature.getProperty("JML_LANTAI"),
        kelurahan: pickedFeature.getProperty("KEL"),
        luas: pickedFeature.getProperty("LUAS_BGN"),
        lat: pickedFeature.getProperty("Latitude"),
        lon: pickedFeature.getProperty("Longitude"),
        nama_wp: pickedFeature.getProperty("NAMA_WP"),
        nik_wp: pickedFeature.getProperty("NIK_WP"),
        nop: pickedFeature.getProperty("NOP"),
        rt: pickedFeature.getProperty("RT"),
        toponimi: pickedFeature.getProperty("Toponimi"),
      };

      buildingDetail.value = data;
      defaultHead.value = buildingHead;
      // Hit Get
    } else if ($Cesium.defined(pickedFeature) && pickedFeature?.id) {
      popupVisible.value = true;
      isLoadingDetail.value = true;
      const entity = pickedFeature.id;
      const props = entity.properties;
      const allAttributes = {};
      for (const key in props) {
        if (props[key] && typeof props[key].getValue === "function") {
          const cleanKey = key.startsWith("_") ? key.slice(1) : key;
          allAttributes[cleanKey] = props[key].getValue();
        }
      }
      console.log(props);
      try {
        const resp = await surveyApi.get_persil_by_fid(
          props._UUID_PRSL.getValue()
        );
        detail.value = resp;
        console.log(resp);
        console.log(allAttributes);

        // console.log(props);
        isLoadingDetail.value = false;
      } catch (error) {
        detail.value = {};
        isLoadingDetail.value = false;
      }
      buildingDetail.value = allAttributes;
      defaultHead.value = {
        ALAMAT_OP: "Alamat Objek Pajak",
        ALAMAT_WP: "Alamat Wajib Pajak",
        JML_BGN: "Jumlah Bangunan",
        KECAMATAN: "Kecamatan",
        KELURAHAN: "Kelurahan",
        L_BUMI: "Luas Bumi",
        NAMA_WP: "Nama Wajib Pajak",
        NOP: "NOP",
        "PAJAK TERH": "Pajak Terhutang",
      };
    }
  }, $Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
const showLod1 = ref(true);
function toggleTileset(lodLevel, isVisible) {
  tilesets[lodLevel].forEach((tileset) => {
    tileset.show = isVisible;
  });
}
watch(showXYZ, (value) => {
  if (awsTiles) {
    awsTiles.show = value;
  }
});
</script>
