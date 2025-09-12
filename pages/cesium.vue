<template>
  <ClientOnly>
    <div v-if="isLoading" class="overlay-loading flex flex-col">
      <v-progress-circular indeterminate color="white" size="64" />
      <p class="text-white">Please wait...</p>
    </div>
    <div class="viewer-container relative w-full h-screen">
      <AppHeaderViewerCesium />
      <div class="absolute top-5 left-5 z-10 mt-4">
        <AppInputAutocomplete
          label="Location"
          v-model="location"
          class="w-[300px]"
          is-filter
          elevation="2"
          append-inner-icon="mdi-magnify"
          :items="[...tiles3dStore.activeBuilding]"
          item-title="name"
          @update:model-value="flyToLocation"
          return-object
        >
          <template #prepend-inner>
            <v-icon color="tertiary">mdi-google-maps</v-icon>
          </template>
        </AppInputAutocomplete>
      </div>

      <div class="absolute top-1/3 -translate-y-1/2 left-5 z-10">
        <CesiumFeature :tile-refs="tileRefs" />
        <CesiumSimulation
          v-model="maxHeight"
          @start="start"
          @pause="pause"
          @reset="reset"
          @stop="stop"
        />
      </div>

      <CesiumOverlayFeature />

      <vc-viewer
        @ready="onViewerReady"
        :show-credit="false"
        :infoBox="false"
        :camera="cameraOptions"
        :clock="clock"
        scene3DOnly
        terrainShadows
        requestRenderMode
      >
        <!-- COMPASS -->
        <vc-navigation
          position="top-right"
          :offset="[0, 20]"
          :printOpts="false"
          :locationOpts="false"
          :zoom-opts="zoomOptions"
        />

        <!-- Bangunan AWS-->
        <vc-primitive-tileset
          :show="
            tiles3dStore.isBuildingActive &&
            tiles3dStore.buildingVariant == 'non-textured'
          "
          v-for="(item, index) in tiles3dStore.activeBuilding"
          :key="index"
          :ref="setTileRefs"
          :url="item.url"
          :maximumScreenSpaceError="maxScreenSpaceError"
        />

        <!-- Jalan -->
        <vc-primitive-tileset
          :show="tiles3dStore.isRoadActive"
          v-for="(item, index) in tiles3dStore.activeRoad"
          :key="index"
          :url="item.url"
          :shadows="0"
          :maximumScreenSpaceError="maxScreenSpaceError"
        />

        <!-- Bangunan Cesium Asset -->
        <vc-primitive-tileset
          preloadWhenHidden
          :show="
            tiles3dStore.isBuildingActive &&
            tiles3dStore.buildingVariant == 'textured'
          "
          v-for="(item, index) in tiles3dStore.activeBuildingCesium"
          :ref="setTileRefs"
          :assetId="Number(item.assetId)"
          :maximumScreenSpaceError="maxScreenSpaceError"
        />

        <vc-terrain-provider-cesium
          ref="provider"
          :assetId="3338372"
          @ready="onTerrainReady"
        />

        <vc-analysis-flood
          @ready="onFloodReady"
          ref="flood"
          :min-height="minHeight"
          :max-height="maxHeight"
          :speed="speed"
          :polygon-hierarchy="polygonHierarchy"
        />
        <!-- BASEMAP LAYER -->
        <CesiumDefaultBasemap />
      </vc-viewer>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import viewerConstant from "~/app/constant/viewer.constant";
definePageMeta({
  layout: "viewer",
});

// Koordinat area banjir
const bontangArea = Cesium.Rectangle.fromDegrees(
  117.45, // barat
  0.1, // selatan
  117.55, // timur
  0.16 // utara
);

// Tinggi awal air
const waterHeight = ref(50); // mulai 5 m

// Material air
const waterMaterial = {
  type: "Water",
  uniforms: {
    baseWaterColor: Cesium.Color.fromCssColorString("rgba(0,100,255,0.6)"),
    blendColor: Cesium.Color.WHITE,
    waveFrequency: 10.0,
    animationSpeed: 0.02,
    amplitude: 1.0,
    specularIntensity: 0.8,
  },
};
const timeline = ref(true);
const maxScreenSpaceError = ref(32);
const todayNoon = Cesium.JulianDate.fromDate(
  new Date(new Date().setHours(12, 0, 0, 0))
);

const clock = ref({
  startTime: todayNoon,
  currentTime: todayNoon,
  stopTime: todayNoon,
  clockRange: Cesium.ClockRange.CLAMPED, // berhenti di waktu itu saja
  clockStep: Cesium.ClockStep.TICK_DEPENDENT,
});
const flood: any = ref(null);
const minHeight = ref(60);
const maxHeight = ref(70);
const speed = ref(0.05);
const pausing = ref(false);
const starting = ref(false);
const polygonHierarchy = ref(viewerConstant.floodPolygon);
const terrainProvider = ref(null);
const onFloodReady = (cesiumInstance: any) => {
  // console.log("Flood Ready:", cesiumInstance);
};
const start = () => {
  flyToLocation({ center_x: " 117.46500", center_y: "0.13500" });
  flood.value?.start();
  pausing.value = false;
  starting.value = true;
};
const pause = () => {
  flood.value?.pause();
  pausing.value = !pausing.value;
};
const stop = () => {
  flood.value?.stop();
  pausing.value = false;
  starting.value = false;
};
const reset = () => {
  flood.value?.reload();
};
const tiles3dStore = use3dTilesStore();
const location = ref();
const router = useRouter();
// Viewer Ref
const refViewer = ref<Cesium.Viewer | null>(null);

// Tiles Ref
const tileRefs = ref<Cesium.Cesium3DTileset[]>([]);
const setTileRefs = (el: any) => {
  if (el?.cesiumObject && !tileRefs.value.includes(el.cesiumObject)) {
    tileRefs.value.push(el.cesiumObject);
  }
};

// Navigation Options
const zoomOptions = ref({
  direction: "horizontal",
  defaultResetView: {
    position: viewerConstant.bontangDefaultPosition,
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-1000),
    roll: 0,
  },
});
const cameraOptions = ref({
  position: viewerConstant.bontangDefaultPosition,
  heading: Cesium.Math.toRadians(0),
  pitch: Cesium.Math.toRadians(-1000),
  roll: 0,
});
// Loading Coindition
const terrainReady = ref(false);
const tilesetsReady = ref(false);
const viewerRaady = ref(false);
const isLoading = ref(true);

function checkAllReady() {
  if (terrainReady.value && tilesetsReady.value && viewerRaady.value) {
    isLoading.value = false;
  }
}

const onTerrainReady = () => {
  terrainReady.value = true;
  checkAllReady();
};

const getDetailBangunan = async (gmlid: string) => {
  await tiles3dStore.getDetailBuilding(gmlid);
};

let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.clock.currentTime = todayNoon;
  refViewer.value = viewer;
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  viewerRaady.value = true;
  checkAllReady();
  handler.setInputAction((movement: any) => {
    const pickedFeature = viewer.scene.pick(movement.endPosition);
    if (
      Cesium.defined(pickedFeature) &&
      pickedFeature instanceof Cesium.Cesium3DTileFeature
    ) {
      if (selectedFeature === pickedFeature) return;
      if (
        Cesium.defined(highlightedFeature) &&
        highlightedFeature !== selectedFeature
      ) {
        highlightedFeature.color = originalHoverColor;
      }
      highlightedFeature = pickedFeature;
      originalHoverColor = Cesium.Color.clone(
        pickedFeature.color,
        new Cesium.Color()
      );
      pickedFeature.color = Cesium.Color.YELLOW;
    } else {
      if (
        Cesium.defined(highlightedFeature) &&
        highlightedFeature !== selectedFeature
      ) {
        highlightedFeature.color = originalHoverColor;
        highlightedFeature = null;
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction((movement: any) => {
    const pickedFeature = viewer.scene.pick(movement.position);
    if (
      Cesium.defined(pickedFeature) &&
      pickedFeature instanceof Cesium.Cesium3DTileFeature
    ) {
      if (Cesium.defined(highlightedFeature)) {
        highlightedFeature.color = originalHoverColor;
        highlightedFeature = null;
      }
      if (Cesium.defined(selectedFeature)) {
        selectedFeature.color = Cesium.Color.WHITE.withAlpha(1.0);
      }
      selectedFeature = pickedFeature;
      pickedFeature.color = Cesium.Color.BLUE.withAlpha(0.8);
      if (Cesium.defined(highlightedFeature)) {
        highlightedFeature.color = originalHoverColor;
        highlightedFeature = null;
      }
      const gmlId = pickedFeature.getProperty("gml:id");
      getDetailBangunan(gmlId);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
// let interval: any;
onMounted(async () => {
  await tiles3dStore.getActiveBuilding();
  await tiles3dStore.getActiveBuildingCesium();
  await tiles3dStore.getActiveRoad();
  await nextTick();
  tilesetsReady.value = true;
  // interval = setInterval(() => {
  //   console.log(waterHeight.value);
  //   waterHeight.value += 1; // naik 1 m setiap 1 detik
  //   if (waterHeight.value > 80) {
  //     // batasi agar tidak kebablasan
  //     waterHeight.value = 5;
  //   }
  // }, 1000);
  checkAllReady();
});

const flyToLocation = (item: any) => {
  const viewer = refViewer.value;

  const destination = Cesium.Cartesian3.fromDegrees(
    Number(item.center_x),
    Number(item.center_y) - 0.002,
    400
  );
  viewer?.camera.flyTo({
    destination: destination,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-55),
      roll: 0,
    },
  });
};
</script>
<style scoped>
.overlay-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* agak gelap */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.viewer-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
