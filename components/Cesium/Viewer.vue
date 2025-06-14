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
$Cesium.Ion.defaultAccessToken = runtimeConfig.public.CESIUM_TOKEN;
onMounted(async () => {
  if (cesiumViewer.value) {
    cViewerStore.cesiumViewer.createViewer(cesiumViewer.value, $Cesium);
    cViewerStore.cesiumViewer.addBaseLayers($Cesium);
    cViewerStore.cesiumViewer.toggleLayer("osm", false);
    cViewerStore.cesiumViewer.toggleLayer("carto", false);
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

// watch(
//   () => props.flyToLocation,
//   (newLocation) => {
//     if (newLocation) {
//       cViewerStore.cesiumViewer.flyToLocation(
//         $Cesium,
//         newLocation.longitude,
//         newLocation.latitude,
//         newLocation.height
//       );
//     }
//   },
//   { deep: true }
// );
</script>
