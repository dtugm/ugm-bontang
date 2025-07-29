<template>
  <ClientOnly>
    <vc-viewer ref="refViewer" @ready="onViewerReady" :show-credit="false">
      <vc-layer-imagery>
        <vc-imagery-provider-osm />
      </vc-layer-imagery>
      <vc-layer-imagery>
        <!-- <vc-imagery-provider-urltemplate
          ref="provider"
          url="https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{reverseY}.png"
        ></vc-imagery-provider-urltemplate> -->
      </vc-layer-imagery>
      <vc-primitive-tileset
        ref="primitive"
        url="https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/3dtiles/Masjid%20Terapung%20Darul%20Irsyad%20Al%20Muhajirin/tileset.json"
      ></vc-primitive-tileset>
      <vc-primitive-tileset
        v-for="(item, index) in tilesArr"
        :key="index"
        ref="primitive"
        :url="item.url"
        maximumScreenSpaceError="32"
      ></vc-primitive-tileset>
      <vc-terrain-provider-cesium
        ref="provider"
        :assetId="3338372"
      ></vc-terrain-provider-cesium>
    </vc-viewer>
  </ClientOnly>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
definePageMeta({
  layout: "viewer",
});
const refViewer = ref(null);
const tiles3dStore = use3dTilesStore();
const tilesArr: any = ref([]);
const primitive = ref();
const featureId = ref("");
let highlightedFeature: any = null;
let originalHoverColor: any = null;
let selectedFeature: any = null;
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      117.49144533245031,
      0.13273319760632002,
      150
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-20),
      roll: 0,
    },
  });
  viewer.scene.globe.depthTestAgainstTerrain = true;

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
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
});
</script>
