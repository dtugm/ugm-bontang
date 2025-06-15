<template>
  <div class="relative w-full h-screen">
    <ClientOnly>
      <CesiumViewer :fly-to-location="flyToLocation" />
    </ClientOnly>
    <div class="absolute top-1 left-2 flex gap-2 z-10">
      <div v-if="mapFeature">
        <v-card max-width="350">
          <v-card-title class="pr-0 pt-0">
            <div class="flex justify-between">
              <NuxtLink to="/">
                <v-img
                  :width="230"
                  aspect-ratio="16/9"
                  cover
                  src="/logo/logo_bontang_2.png"
                ></v-img>
              </NuxtLink>
              <v-btn
                color="error"
                class="rounded-sm ml-1"
                elevation="0"
                size="x-small"
                icon
                @click="mapFeature = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-title>
          <v-card-text class="flex justify-between pb-0">
            <div class="d-flex py-3 justify-space-between">
              <v-list-item density="compact" prepend-icon="mdi-weather-windy">
                <v-list-item-subtitle>123 km/h</v-list-item-subtitle>
              </v-list-item>

              <v-list-item density="compact" prepend-icon="mdi-weather-pouring">
                <v-list-item-subtitle>48%</v-list-item-subtitle>
              </v-list-item>
            </div>
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
                  <AppInputAutocomplete
                    placeholder="Location"
                    v-model="test"
                    :items="tiles3dStore.tiles3dItems"
                    item-title="name"
                    is-filter
                    hide-details
                    return-object
                    @update:model-value="changeLocation"
                  />
                </v-list-item>
                <v-list-item title="Filter">
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
      </div>
      <v-btn v-if="!mapFeature" @click="mapFeature = !mapFeature">
        Map Feature
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
const expand = ref(false);
const test = ref();
definePageMeta({
  layout: "viewer",
});
const tiles3dStore = use3dTilesStore();
const { $Cesium } = useNuxtApp();
const mapFeature = ref(false);
onMounted(async () => {
  await tiles3dStore.getAll3dTiles();
  await cViewerStore.cesiumViewer.viewer;
  // console.log(tiles3dStore.tiles3dItems.length);
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
const changeLocation = (item: IUpload3dTilesPayload) => {
  cViewerStore.cesiumViewer.flyToLocation(
    $Cesium,
    Number(item.center_x),
    Number(item.center_y),
    500
  );
};
</script>
