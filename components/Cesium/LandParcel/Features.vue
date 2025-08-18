<template>
  <div class="absolute top-1/3 -translate-y-1/2 left-5 z-10">
    <div class="flex flex-col gap-2">
      <CesiumLandParcelBaseMapFeature />
      <CesiumLandParcelObjectFeature />
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
                { title: 'Kebaruan Bangunan', value: 'showBuilding' },
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
              <AppInputAutocomplete
                v-if="jenisFilter == 'buildingFloorType'"
                :rules="[(value:any) => !!value || 'This field is required']"
                :items="buildingStore.floorTypeOptions"
                label="Jenis Lantai"
                v-model="buildingFloorType"
                hide-details
              />
              <AppInputAutocomplete
                v-if="jenisFilter == 'buildingType'"
                :rules="[(value:any) => !!value || 'This field is required']"
                label="Jenis Bangunan"
                :items="buildingStore.buildingTypeOptions"
                v-model="buildingType"
                hide-details
              />
              <AppInputAutocomplete
                v-if="jenisFilter == 'buildingConstruction'"
                :rules="[(value:any) => !!value || 'This field is required']"
                label="Jenis Konstruksi"
                :items="buildingStore.buildingConstructionOptions"
                v-model="buildingConstruction"
                hide-details
              />
              <AppInputAutocomplete
                v-if="jenisFilter == 'roofType'"
                :rules="[(value:any) => !!value || 'This field is required']"
                label="Jenis Roof"
                :items="buildingStore.roofTypeOptions"
                v-model="roofType"
                hide-details
              />
              <AppInputAutocomplete
                v-if="jenisFilter == 'showBuilding'"
                :rules="[(value:any) => !!value || 'This field is required']"
                :items="buildingStore.updateByLuasBangunan"
                label="Kebaruan Bangunan"
                v-model="showBuilding"
                hide-details
              />
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
              @click="resetTileset"
              >Reset Filter</v-btn
            >
          </v-card-text>
        </v-card>
      </v-menu>
      <CesiumLandParcelTable />
    </div>
  </div>
</template>
<script setup lang="ts">
const filterLoading = ref(false);
const jenisFilter = ref();
const buildingStore = useBuildingDataStore();
const formFilterRef = ref();
const floorCount = ref();
const buildingFloorType = ref(null);
const buildingType = ref(null);
const buildingConstruction = ref(null);
const roofType = ref(null);
const showBuilding = ref(null);
const viewerStore = use3dTilesStore();
import * as Cesium from "cesium";
const props = defineProps<{
  tileRefs: Cesium.Cesium3DTileset[];
}>();
const modelMap: any = {
  buildingType,
  buildingConstruction,
  roofType,
  floorCount,
  buildingFloorType,
  showBuilding,
};
const selectedValue = computed(() => modelMap[jenisFilter.value]?.value);
const submitFilter = async () => {
  const { valid } = await formFilterRef.value.validate();
  if (valid) {
    filterLoading.value = true;
    const arr = await viewerStore.filterBuilding({
      [jenisFilter.value]: selectedValue.value,
      pageSize: 20000,
    });
    filterTilesetColor(arr);
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
function filterTilesetColor(arr: any[]) {
  const idsToShow = arr;

  props.tileRefs.forEach((tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);
        const featureId = feature.getProperty("gml:id");

        if (idsToShow.includes(featureId)) {
          // 🔹 Kasih warna hijau kalau ID ada di array
          feature.color = Cesium.Color.GREEN;
        } else {
          // 🔹 Default (misalnya putih/transparan)
          feature.color = Cesium.Color.WHITE;
        }
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
function resetTileset() {
  props.tileRefs.forEach((tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);

        // 🔹 Balikin ke warna default
        feature.color = Cesium.Color.WHITE;
        // atau kalau default-nya bawaan tileset, bisa pakai:
        // feature.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, 1.0);
      }
    });
  });
}
</script>
