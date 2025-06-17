<template>
  <div ref="cesiumViewer" class="w-full h-screen" />
</template>

<script setup lang="ts">
const cesiumViewer = ref(null);
const { $Cesium } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const cViewerStore = useViewerStore();
const props = defineProps({
  flyToLocation: Object,
});
$Cesium.Ion.defaultAccessToken = runtimeConfig.public.CESIUM_TOKEN_FK;
onMounted(async () => {
  if (cesiumViewer.value) {
    cViewerStore.cesiumViewer.createViewer(cesiumViewer.value, $Cesium);
    cViewerStore.cesiumViewer.addBaseLayers($Cesium);

    cViewerStore.cesiumViewer.toggleLayer("osm", true);
    cViewerStore.cesiumViewer.toggleLayer("carto", false);
    // await cViewerStore.cesiumViewer.setTerrain($Cesium, 3462479);
    await cViewerStore.cesiumViewer.addXYZLayer(
      $Cesium,
      "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{reverseY}.png"
    );

    cViewerStore.cesiumViewer.toggleXYZLayer(false);

    if (props.flyToLocation) {
      cViewerStore.cesiumViewer.flyToLocation(
        $Cesium,
        props.flyToLocation.longitude,
        props.flyToLocation.latitude,
        props.flyToLocation.height
      );
    }
  }
});
</script>
