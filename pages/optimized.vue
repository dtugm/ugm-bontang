<template>
  <div class="relative w-full h-screen">
    <ClientOnly>
      <CesiumViewer :fly-to-location="flyToLocation" />
    </ClientOnly>

    <div class="absolute top-4 left-4 flex gap-2 z-10">
      <NuxtLink to="/">
        <v-btn>Home</v-btn>
      </NuxtLink>
      <v-btn @click="flyTo">FlyTo</v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "viewer",
});
const { $Cesium } = useNuxtApp();
const cViewerStore = useViewerStore();
const flyToLocation = ref({
  longitude: 117.4926,
  latitude: 0.1334,
  height: 10000,
});

const flyTo = async () => {
  // cViewerStore.cesiumViewer.toggleLayer("osm", true);
  await cViewerStore.cesiumViewer.addXYZLayer(
    $Cesium,
    "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{reverseY}.png"
  );
  // cViewerStore.cesiumViewer.toggleXYZLayer(true);
  // cViewerStore.cesiumViewer.flyToLocation($Cesium, 118.4926, 0.1334, 10000);
};
</script>
