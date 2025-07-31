<template>
  <div class="flex gap-1 flex-col">
    <v-menu :close-on-content-click="false" location="left">
      <template v-slot:activator="{ props }">
        <v-btn color="tertiary" v-bind="props" class="text-none" icon>
          <v-icon>mdi-map</v-icon></v-btn
        >
      </template>

      <v-card class="rounded-lg">
        <v-card-text>
          <p class="text-grey pb-1">Base Map Layer</p>
          <v-radio-group
            v-model="tiles3dStore.layer"
            hide-details
            inline
            class="pb-4"
          >
            <v-radio value="osm">
              <template #label>
                <v-row align="center" no-gutters>
                  <v-img
                    src="/logo/osm.png"
                    width="34"
                    height="34"
                    class="mr-2"
                    cover
                    eager
                  />
                  <span>OSM</span>
                </v-row>
              </template>
            </v-radio>

            <v-radio value="arcgis">
              <template #label>
                <v-row align="center" no-gutters>
                  <v-img
                    src="/logo/world_image.png"
                    width="34"
                    height="34"
                    class="mr-2"
                    cover
                  />
                  <span>ArcGis</span>
                </v-row>
              </template>
            </v-radio>
          </v-radio-group>
          <hr />
          <p class="text-grey pt-3">OrthoPhoto Lidar</p>
          <v-checkbox v-model="tiles3dStore.orthoPhoto" hide-details>
            <template #label>
              <v-row align="center" no-gutters>
                <v-img
                  src="/logo/ortho.png"
                  width="34"
                  height="34"
                  class="mr-2 full-opacity"
                  cover
                />
                <span>OrthoPhoto</span>
              </v-row>
            </template>
          </v-checkbox>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-menu :close-on-content-click="false" location="left">
      <template v-slot:activator="{ props }">
        <v-btn color="tertiary" v-bind="props" class="text-none" icon>
          <v-icon>mdi-office-building</v-icon></v-btn
        >
      </template>
      <v-card class="rounded-lg">
        <v-card-text>
          <p class="text-grey">3D Tiles Object</p>
          <div class="flex">
            <v-checkbox v-model="tiles3dStore.isBuildingActive" hide-details>
              <template #label>
                <v-icon color="tertiary">mdi-home-city</v-icon>
              </template>
            </v-checkbox>
            <v-checkbox v-model="tiles3dStore.isRoadActive" hide-details>
              <template #label>
                <v-icon color="tertiary">mdi-road-variant</v-icon>
              </template>
            </v-checkbox>
            <v-checkbox disabled hide-details>
              <template #label>
                <v-icon color="tertiary">mdi-palm-tree</v-icon>
              </template>
            </v-checkbox>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-menu :close-on-content-click="false" location="left">
      <template v-slot:activator="{ props }">
        <v-btn color="tertiary" v-bind="props" class="text-none" icon>
          <v-icon>mdi-filter</v-icon></v-btn
        >
      </template>
      <v-card class="rounded-lg" width="250">
        <v-card-text>
          <AppInputAutocomplete
            label="Filter By"
            hide-details
            class="pb-2"
            v-model="jenisFilter"
            clearable
            :items="[
              { title: 'Jenis Bangunan', value: 'buildingType' },
              { title: 'Konstruksi', value: 'buildingConstruction' },
              { title: 'Jenis Atap', value: 'roofType' },
              { title: 'Jumlah Lantai', value: 'floorCount' },
              { title: 'Jenis Lantai', value: 'buildingFloorType' },
            ]"
          />
          <v-form
            id="filterBangunan"
            ref="formFilterRef"
            @submit.prevent="submitFilter()"
          >
            <AppInputText
              v-if="jenisFilter == 'floorCount'"
              :rules="[(value:any) => !!value || 'This field is required']"
              type="number"
              label="Jumlah Lantai"
              v-model="floorCount"
              hide-details
            />
            <!-- <AppInputAutocomplete
              v-if="jenisFilter == 'jenis_lantai'"
              :rules="[(value:any) => !!value || 'This field is required']"
              label="Jenis Lantai"
              v-model="buildingFloorType"
              hide-details
            />
            <AppInputAutocomplete
              v-if="jenisFilter == 'jenis_bgn'"
              :rules="[(value:any) => !!value || 'This field is required']"
              label="Jenis Building"
              v-model="buildingType"
              hide-details
            />
            <AppInputAutocomplete
              v-if="jenisFilter == 'konstruksi'"
              :rules="[(value:any) => !!value || 'This field is required']"
              label="Jenis Konstruksi"
              v-model="buildingConstruction"
              hide-details
            />
            <AppInputAutocomplete
              v-if="jenisFilter == 'jenis_atap'"
              :rules="[(value:any) => !!value || 'This field is required']"
              label="Jenis Roof"
              v-model="roofType"
              hide-details
            /> -->
          </v-form>
          <v-btn
            block
            color="tertiary"
            class="text-none mt-2"
            type="submit"
            form="filterBangunan"
            :loading="filterLoading"
            >Filter</v-btn
          >
          <v-btn
            block
            color="tertiary"
            class="text-none mt-1"
            variant="outlined"
            @click="showAllTileset"
            >Reset Filter</v-btn
          >
        </v-card-text>
      </v-card>
    </v-menu>
    <!-- <v-btn @click="filterTileset" color="tertiary" icon>
      <v-icon>mdi-office-building</v-icon>
    </v-btn>
    <v-btn @click="showAllTileset" color="tertiary" icon></v-btn> -->
  </div>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
const jenisFilter = ref();
const tiles3dStore = use3dTilesStore();
const filterLoading = ref(false);
const props = defineProps<{
  tileRefs: Cesium.Cesium3DTileset[];
}>();
const formFilterRef = ref();
const floorCount = ref();
const buildingFloorType = ref(null);
const buildingType = ref(null);
const buildingConstruction = ref(null);
const roofType = ref(null);
const modelMap: any = {
  buildingType,
  buildingConstruction,
  roofType,
  floorCount,
  buildingFloorType,
};
const selectedValue = computed(() => modelMap[jenisFilter.value]?.value);
const submitFilter = async () => {
  const { valid } = await formFilterRef.value.validate();
  if (valid) {
    filterLoading.value = true;
    const arr = await tiles3dStore.filterBuilding({
      [jenisFilter.value]: selectedValue.value,
      pageSize: 10000,
    });
    filterTileset(arr);
    filterLoading.value = false;
  }
};
function filterTileset(arr: any[]) {
  const idsToShow = arr;

  props.tileRefs.forEach((tileset) => {
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
  props.tileRefs.forEach((tileset) => {
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
.full-opacity {
  opacity: 1 !important;
}
</style>
