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
    </div>
    <div class="absolute top-1 left-2 flex gap-2 z-10">
      <v-card v-if="mapFeature">
        <v-card-text class="flex justify-between pb-0">
          <NuxtLink to="/">
            <v-img
              :width="230"
              aspect-ratio="16/9"
              cover
              src="/logo/logo_bontang_2.png"
            ></v-img>
          </NuxtLink>
        </v-card-text>
        <v-expand-transition>
          <div v-if="expand">
            <v-list class="bg-transparent">
              <v-list-item title="Layer">
                <div class="flex gap-2">
                  <v-switch
                    color="tertiary"
                    label="OrthoPhoto"
                    v-model="orthoLayer"
                    inset
                    hide-details
                    @update:model-value="updateLayerOrtho"
                  />
                  <v-switch
                    color="tertiary"
                    label="Building"
                    v-model="orthoLayer"
                    inset
                    hide-details
                    @update:model-value="updateLayerOrtho"
                  />
                </div>
              </v-list-item>
              <v-list-item title="Location">
                <AppInputAutocomplete hide-details />
              </v-list-item>
            </v-list>
          </div>
        </v-expand-transition>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            :text="!expand ? 'open Feature' : 'Close Feature'"
            @click="expand = !expand"
          ></v-btn>
        </v-card-actions>
      </v-card>
      <v-btn v-if="!mapFeature" @click="mapFeature = !mapFeature">
        Map Feature
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
const labels = {
  0: "SU",
  1: "MO",
  2: "TU",
  3: "WED",
  4: "TH",
  5: "FR",
  6: "SA",
};
const forecast = [
  {
    day: "Tuesday",
    icon: "mdi-white-balance-sunny",
    temp: "24\u00B0/12\u00B0",
  },
  {
    day: "Wednesday",
    icon: "mdi-white-balance-sunny",
    temp: "22\u00B0/14\u00B0",
  },
  { day: "Thursday", icon: "mdi-cloud", temp: "25\u00B0/15\u00B0" },
];
const expand = ref(false);
definePageMeta({
  layout: "viewer",
});
const tiles3dStore = use3dTilesStore();
const { $Cesium } = useNuxtApp();
const mapFeature = ref(false);
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
