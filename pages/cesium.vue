<template>
  <ClientOnly>
    <div v-if="isLoading" class="overlay-loading flex flex-col">
      <v-progress-circular indeterminate color="white" size="64" />
      <p class="text-white">Please wait...</p>
    </div>
    <div class="viewer-container relative w-full h-screen">
      <div class="absolute top-0 w-full z-10 bg-black flex justify-between">
        <v-btn
          size="30"
          variant="flat"
          class="text-none rounded-0"
          icon
          color="black"
          @click="router.back()"
        >
          <v-icon>mdi-keyboard-backspace</v-icon>
        </v-btn>
        <div>Digital Twin Bontang</div>
        <div>
          <v-img src="/logo/Logo_1.png" width="30" height="30"> </v-img>
        </div>
      </div>
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
        <v-menu :close-on-content-click="false" location="left">
          <template v-slot:activator="{ props }">
            <v-btn color="tertiary" v-bind="props" class="text-none mt-1" icon>
              <v-icon>mdi-home-flood</v-icon>
            </v-btn>
          </template>

          <v-card class="rounded-lg" width="300">
            <v-card-text>
              <div class="text-subtitle-2 mb-2">
                Tinggi Banjir ({{ maxHeight }}m)
              </div>
              <v-slider
                v-model="maxHeight"
                :min="60"
                :max="90"
                :step="5"
                class="mb-2"
                thumb-label
                :ticks="tickLabels"
                show-ticks="always"
                hide-details
              ></v-slider>

              <v-btn block color="tertiary" class="mt-5" @click="start">
                Start
              </v-btn>
              <div class="flex justify-between">
                <v-btn color="primary-blue" class="mt-5" @click="reset">
                  Reset
                </v-btn>
                <v-btn color="success" class="mt-5" @click="pause">
                  Pause
                </v-btn>
                <v-btn color="error" class="mt-5" @click="stop"> Stop </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
        <!-- <AppInputText v-model="speed" type="number"></AppInputText> -->
      </div>
      <div class="absolute top-1/2 -translate-y-1/2 right-5 z-10"></div>

      <CesiumOverlayFeature />

      <vc-viewer
        @ready="onViewerReady"
        :show-credit="false"
        :infoBox="false"
        :camera="cameraOptions"
      >
        <vc-layer-imagery v-if="tiles3dStore.orthoPhoto">
          <vc-imagery-provider-urltemplate
            ref="provider"
            url="https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/orthoBontangFull/{z}/{x}/{reverseY}.png"
          ></vc-imagery-provider-urltemplate>
        </vc-layer-imagery>
        <vc-layer-imagery v-if="tiles3dStore.layer == 'arcgis'">
          <vc-imagery-provider-arcgis :alpha="1"></vc-imagery-provider-arcgis>
        </vc-layer-imagery>
        <vc-layer-imagery v-if="tiles3dStore.layer == 'osm'">
          <vc-imagery-provider-osm />
        </vc-layer-imagery>
        <vc-navigation
          position="top-right"
          :offset="[0, 20]"
          :printOpts="false"
          :locationOpts="false"
          :zoom-opts="zoomOptions"
        >
        </vc-navigation>

        <!-- Bangunan AWS-->
        <!-- <vc-primitive-tileset
          v-if="tiles3dStore.isBuildingActive"
          v-for="(item, index) in tiles3dStore.activeBuilding"
          :key="index"
          :ref="setTileRefs"
          :url="item.url"
          :maximumScreenSpaceError="32"
        /> -->

        <!-- Jalan -->
        <vc-primitive-tileset
          v-if="tiles3dStore.isRoadActive"
          v-for="(item, index) in tiles3dStore.activeRoad"
          :key="index"
          :url="item.url"
          :shadows="0"
          :maximumScreenSpaceError="32"
        />

        <!-- Bangunan -->
        <vc-primitive-tileset
          :ref="setTileRefs"
          :assetId="3614335"
          :maximumScreenSpaceError="32"
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
        >
        </vc-analysis-flood>
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
const tickLabels = viewerConstant.floodTickLabel;
const flood: any = ref(null);
const minHeight = ref(60);
const maxHeight = ref(70);
const speed = ref(0.05);
const pausing = ref(false);
const starting = ref(false);
const polygonHierarchy = ref(viewerConstant.floodPolygon);
const onFloodReady = (cesiumInstance: any) => {
  // console.log("Flood Ready:", cesiumInstance);
};
const start = () => {
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

let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;

const getDetailBangunan = async (gmlid: string) => {
  await tiles3dStore.getDetailBuilding(gmlid);
};
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      viewerConstant.bontangDefaultPosition.lng,
      viewerConstant.bontangDefaultPosition.lat,
      viewerConstant.bontangDefaultPosition.height
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-20),
      roll: 0,
    },
  });
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
      const gmlId = pickedFeature.getProperty("gml:id");
      getDetailBangunan(gmlId);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
onMounted(async () => {
  await tiles3dStore.getActiveBuilding();
  await tiles3dStore.getActiveRoad();
  await nextTick();
  tilesetsReady.value = true;
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
