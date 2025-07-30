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
      <div class="absolute top-4 left-5 z-10 mt-4">
        <AppInputAutocomplete
          label="Location"
          class="w-[300px]"
          is-filter
          elevation="2"
          append-inner-icon="mdi-magnify"
        >
          <template #prepend-inner>
            <v-icon color="tertiary">mdi-google-maps</v-icon>
          </template>
        </AppInputAutocomplete>
      </div>

      <div class="absolute top-4 right-5 z-10 mt-4">
        <CesiumFeature :tile-refs="tileRefs" />
      </div>

      <CesiumOverlayFeature />

      <vc-viewer
        ref="refViewer"
        @ready="onViewerReady"
        :show-credit="false"
        :infoBox="false"
      >
        <vc-navigation
          position="top-right"
          :offset="[0, 60]"
          :printOpts="false"
          :locationOpts="false"
          :zoom-opts="zoomOptions"
        >
        </vc-navigation>
        <vc-layer-imagery>
          <vc-imagery-provider-osm />
        </vc-layer-imagery>

        <vc-primitive-tileset
          v-for="(item, index) in tilesArr"
          :key="index"
          :ref="setTileRefs"
          :url="item.url"
          :maximumScreenSpaceError="32"
        />
        <vc-terrain-provider-cesium
          ref="provider"
          :assetId="3338372"
          @ready="onTerrainReady"
        />
      </vc-viewer>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
definePageMeta({
  layout: "viewer",
});
const tiles3dStore = use3dTilesStore();
const tilesArr: any = ref([]);

// Viewer Ref
const refViewer: any = ref(null);

// Tiles Ref
const tileRefs = ref<Cesium.Cesium3DTileset[]>([]);
const setTileRefs = (el: any) => {
  if (el?.cesiumObject && !tileRefs.value.includes(el.cesiumObject)) {
    tileRefs.value.push(el.cesiumObject);
  }
};

// Navigation Options
const zoomOptions = {
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
};
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

let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;

const getDetailBangunan = async (gmlid: string) => {
  await tiles3dStore.getDetailBuilding(gmlid);
};
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
      const gmlId = pickedFeature.getProperty("gml:id");
      getDetailBangunan(gmlId);
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
function filterTileset() {
  const idsToShow = ["BB_15062025-AAAA-04757-GeoAI02-077C3EF"];
  console.log(tileRefs.value);
  tileRefs.value.forEach((tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);
        const featureId = feature.getProperty("gml:id");

        feature.show = idsToShow.includes(featureId);
      }
    });
  });
}

function showAllTileset() {
  tileRefs.value.forEach((tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);
        feature.show = true;
      }
    });
  });
}
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
