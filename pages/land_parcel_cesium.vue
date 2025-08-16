<template>
  <ClientOnly>
    <div v-if="isLoading" class="overlay-loading flex flex-col">
      <v-progress-circular indeterminate color="white" size="64" />
      <p class="text-white">Please wait...</p>
    </div>
    <div class="viewer-container relative w-full h-screen">
      <AppHeaderViewerCesium />
      <CesiumLandParcelFeature />

      <CesiumLandParcelFeatures />

      <!-- DETAIL FIELD -->
      <CesiumOverlayFeature />

      <!-- VIEWER -->
      <vc-viewer
        @ready="onViewerReady"
        :show-credit="false"
        :infoBox="false"
        :camera="cameraOptions"
      >
        <!-- COMPASS -->
        <vc-navigation
          position="top-right"
          :offset="[0, 20]"
          :printOpts="false"
          :locationOpts="false"
          :zoom-opts="zoomOptions"
        >
        </vc-navigation>

        <!-- Bangunan AWS-->
        <vc-primitive-tileset
          :show="viewerStore.isBuildingActive"
          v-for="(item, index) in viewerStore.activeBuilding"
          :key="index"
          :ref="setTileRefs"
          :url="item.url"
          :maximumScreenSpaceError="32"
        />

        <!-- DATA PERSIL -->
        <vc-datasource-geojson
          ref="geojson"
          v-for="(item, index) in viewerStore.activeLandParcel"
          :data="item.url"
          :clamp-to-ground="false"
          stroke="red"
          :strokeWidth="10"
          :entities="entities"
          @click="clickPersil"
        ></vc-datasource-geojson>

        <!-- Batas Kelurahan -->
        <vc-datasource-geojson
          ref="datasourceRef"
          data="/new_bontang.geojson"
          :clampToGround="false"
          stroke="red"
          fill="transparent"
          :strokeWidth="10"
        ></vc-datasource-geojson>

        <!-- BASEMAP LAYER -->
        <CesiumDefaultBasemap />
      </vc-viewer>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
definePageMeta({
  layout: "viewer",
});
const route: any = useRoute();
const viewerStore = useViewerLandParcelStore();
const surveyDataStore = useSurveyDataStore();
const tiles3dStore = use3dTilesStore();
const location = ref();

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
    position: {
      lng: 117.49144533245031,
      lat: 0.13273319760632002,
      height: 200,
    },
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-1000),
    roll: 0,
  },
});

const cameraOptions = ref({
  position: {
    lng: 117.476246,
    lat: 0.170182,
    height: 1500,
  },
});

// Loading Coindition
const tilesetsReady = ref(false);
const viewerRaady = ref(false);
const isLoading = ref(true);

function checkAllReady() {
  if (tilesetsReady.value && viewerRaady.value) {
    isLoading.value = false;
  }
}

let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;

const getDetailBangunan = async (gmlid: string) => {
  await tiles3dStore.getDetailBuilding(gmlid);
};
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewer.scene.globe.depthTestAgainstTerrain = true;
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
      useLotSurveyMonitoringStore.popUpParcel = false;
      const gmlId = pickedFeature.getProperty("gml:id");
      getDetailBangunan(gmlId);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const entities: any = reactive([]);
const geojson: any = ref(null);
onMounted(async () => {
  if (route.query && Object.keys(route.query).length > 0) {
    if (route.query.uuid) {
      await useLotSurveyMonitoringStore.getDetailPersil(route.query.uuid);
      viewerStore.isBuildingActive = false;
    } else if (route.query.uuid_bgn) {
      await getDetailBangunan(route.query.uuid_bgn);
      viewerStore.isBuildingActive = true;
    }

    cameraOptions.value.position = {
      lat: Number(route.query.lat),
      lng: Number(route.query.lng),
      height: 70,
    };
  }

  await viewerStore.getActiveBuilding();
  await viewerStore.getActiveLandParcel();
  await nextTick();
  tilesetsReady.value = true;
  checkAllReady();
});

const flyToLocation = (item: any) => {
  const viewer = refViewer.value;

  const destination = Cesium.Cartesian3.fromDegrees(
    Number(item.center_x),
    Number(item.center_y) - 0.002, // offset sedikit ke selatan
    400 // ketinggian kamera
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
const useLotSurveyMonitoringStore = useLotSurveyMonitoring();
const clickPersil = async (e: any) => {
  tiles3dStore.popUpBuildingBuilding = false;
  const item = e.pickedFeature.id.properties.getValue();
  await useLotSurveyMonitoringStore.getDetailPersil(item.UUID);
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
