<template>
  <div class="relative w-full h-screen">
    <ClientOnly>
      <CesiumViewer :fly-to-location="flyToLocation" />
    </ClientOnly>

    <div class="absolute top-4 right-4 flex gap-2 z-10">
      <NuxtLink to="/">
        <v-btn>Home</v-btn>
      </NuxtLink>
      <!-- <v-btn @click="flyTo">FlyTo</v-btn> -->
      <v-switch
        v-model="orthoLayer"
        inset
        @update:model-value="updateLayerOrtho"
      />
    </div>
    <!-- <div class="absolute top-1 left-2 flex gap-2 z-10">
      <NuxtLink to="/">
        <v-img width="50" src="/logo/logo_1.png"></v-img>
      </NuxtLink>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "viewer",
});
const tiles3dStore = use3dTilesStore();
const { $Cesium } = useNuxtApp();
onMounted(async () => {
  await tiles3dStore.getAll3dTiles();
  await cViewerStore.cesiumViewer.viewer;
  console.log(tiles3dStore.tiles3dItems.length);
  await cViewerStore.cesiumViewer.setTerrain($Cesium);
  for (const item of tiles3dStore.tiles3dItems) {
    console.log(item);
    await cViewerStore.cesiumViewer.addTileset(item.url, $Cesium);
  }
});
const cViewerStore = useViewerStore();
const flyToLocation = ref({
  longitude: 117.4926,
  latitude: 0.1334,
  height: 5000,
});
const orthoLayer: any = ref(false);
const updateLayerOrtho = (val: boolean) => {
  cViewerStore.cesiumViewer.toggleXYZLayer(val);
};
</script>
