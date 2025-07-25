<template>
  <div class="relative w-full h-screen">
    <ClientOnly>
      <CesiumViewer :fly-to-location="flyToLocation" />
    </ClientOnly>
    <div
      v-if="cViewerStore.cesiumViewer.propertiesModal"
      class="absolute bottom-1 right-2 flex gap-2 z-10"
    >
      <AppCardViewerDetail
        title="Building Detail"
        :value="cViewerStore.cesiumViewer.selectedProperties"
      />
    </div>
    <div class="absolute top-1 left-2 flex gap-2 z-10">
      <div v-if="mapFeature">
        <!-- <v-btn @click="testFilter">TesFilter</v-btn>
        <v-btn @click="resetFilter">Reset Filter</v-btn> -->
        <v-card
          max-width="350"
          :style="{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }"
        >
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
                      v-model="buildingLayer"
                      inset
                      hide-details
                      @update:model-value="updateLayerBuilding"
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
                  <!-- {{ jumlah_lantai }} -->
                  <AppInputAutocomplete
                    v-model="jumlah_lantai"
                    label="Jumlah Lantai"
                    is-filter
                    class="flex-1 pt-1"
                    :items="['1', '2', '3', '4']"
                  />
                  <!-- <AppInputAutocomplete
                    label="Jumlah Lantai"
                    is-filter
                    class="flex-1"
                  /> -->
                  <!-- <AppInputAutocomplete class="flex-1" />
                  <AppInputAutocomplete class="flex-1" />
                  <AppInputAutocomplete class="flex-1" />
                  <AppInputAutocomplete class="flex-1" /> -->
                  <v-switch
                    v-model="isRealData"
                    :label="isRealData ? 'Using Real Data' : 'Using Dream'"
                    color="success"
                  ></v-switch>
                  <div class="flex gap-2">
                    <v-btn
                      class="flex-1"
                      color="tertiary"
                      elevation="0"
                      @click="testFilter"
                      >Filter</v-btn
                    >
                    <v-btn
                      class="flex-1"
                      color="primary"
                      variant="outlined"
                      @click="resetFilter"
                      >Reset</v-btn
                    >
                  </div>
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
const jumlah_lantai = ref(null);
const isRealData = ref(false);
definePageMeta({
  layout: "viewer",
});
const tiles3dStore = use3dTilesStore();
const { $Cesium } = useNuxtApp();
const mapFeature = ref(false);
onMounted(async () => {
  await tiles3dStore.getAll3dTiles();
  await cViewerStore.cesiumViewer.viewer;
  await cViewerStore.cesiumViewer.setTerrain($Cesium);
  for (const item of tiles3dStore.tiles3dItems) {
    await cViewerStore.cesiumViewer.addTileset(item.id, item.url, $Cesium);
  }
  cViewerStore.cesiumViewer.enableHoverHighlight(
    cViewerStore.cesiumViewer.viewer,
    $Cesium
  );
  cViewerStore.cesiumViewer.enableSingleClickSelection(
    cViewerStore.cesiumViewer.viewer,
    $Cesium
  );
  cViewerStore.cesiumViewer.enableClickGetProperties(
    cViewerStore.cesiumViewer.viewer,
    $Cesium
  );
  cViewerStore.cesiumViewer.addPin();
});
const cViewerStore = useViewerStore();
const flyToLocation = ref({
  longitude: 117.4926,
  latitude: 0.1334,
  height: 5000,
});
const orthoLayer: any = ref(false);
const buildingLayer: any = ref(true);
const updateLayerOrtho = (val: boolean) => {
  cViewerStore.cesiumViewer.toggleXYZLayer(val);
};
const updateLayerBuilding = (val: boolean) => {
  console.log(val);
  if (val) {
    console.log("show");
    cViewerStore.cesiumViewer.showAll();
  } else {
    console.log("hide");
    cViewerStore.cesiumViewer.hideAll();
  }
};
const changeLocation = (item: IUpload3dTilesPayload) => {
  cViewerStore.cesiumViewer.flyToLocation(
    $Cesium,
    Number(item.center_x),
    Number(item.center_y),
    500
  );
};
const buildingDataStore = useBuildingDataStore();
const testFilter = async () => {
  console.log("first");
  if (isRealData.value) {
    const ids = await buildingDataStore.getBuildingByFilter({
      floorCount: jumlah_lantai.value,
      pageSize: 10000,
    });
    cViewerStore.cesiumViewer.filterAllTilesets(ids);
  } else {
    console.log("else");
    cViewerStore.cesiumViewer.filterAllTilesetsCustom(
      "bldg:storeysaboveground",
      Number(jumlah_lantai.value)
    );
  }
  // cViewerStore.cesiumViewer.filterAllTilesets([
  //   "BB_15062025-AAAA-01694-GeoAI02-AC525AC",
  //   "BB_15062025-AAAA-01003-GeoAI02-E7EACE3",
  // ]);
};
const resetFilter = () => {
  cViewerStore.cesiumViewer.resetAllTilesets();
};
</script>
