<template>
  <ClientOnly>
    <div v-if="isLoading" class="overlay-loading flex flex-col">
      <v-progress-circular indeterminate color="white" size="64" />
      <p class="text-white">Please wait...</p>
    </div>
    <div class="viewer-container relative w-full h-screen">
      <div class="absolute top-0 w-full z-10 space-y-2 bg-black text-center">
        Digital Twin Bontang
      </div>
      <vc-viewer ref="refViewer" @ready="onViewerReady" :show-credit="false">
        <vc-layer-imagery>
          <vc-imagery-provider-osm />
        </vc-layer-imagery>

        <vc-datasource-geojson
          ref="datasourceRef"
          data="/new_bontang.geojson"
          :clampToGround="false"
          stroke="red"
          fill="transparent"
          :strokeWidth="10"
        ></vc-datasource-geojson>
        <vc-datasource-geojson
          ref="datasourceRef"
          data="/SurveyPbb/peta_kerja_bontang_baru.geojson"
          stroke="blue"
          :clamp-to-ground="false"
        ></vc-datasource-geojson>
      </vc-viewer>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "viewer",
});
const refViewer = ref(null);
const tiles3dStore = use3dTilesStore();
const tilesArr: any = ref([]);
const primitive = ref();
const featureId = ref("");
const isLoading = ref(true);
const terrainReady = ref(false);
const tilesetsReady = ref(false);
const viewerRaady = ref(false);

function checkAllReady() {
  if (tilesetsReady.value && viewerRaady.value) {
    isLoading.value = false;
  }
}
let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      117.49144533245031,
      0.13273319760632002,
      200
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-20),
      roll: 0,
    },
  });
  viewer.scene.globe.depthTestAgainstTerrain = true;

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
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
onMounted(async () => {
  const resp = await tiles3dStore.getAll3dTiles();
  console.log(resp);
  tilesArr.value = resp;
  await nextTick();
  tilesetsReady.value = true;
  checkAllReady();
});
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
