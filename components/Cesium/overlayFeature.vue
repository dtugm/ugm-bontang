<template>
  <div class="absolute bottom-1 right-1 z-10 mt-4">
    <v-card
      v-if="popUpBuilding"
      title="Building Detail"
      class="rounded-lg"
      max-height="400"
      width="450"
    >
      <template v-slot:append>
        <v-menu :close-on-content-click="false" location="top" :offset="[0, 0]">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              class="text-none my-1"
              variant="flat"
              prepend-icon="mdi-file-image"
              >Image
            </v-btn>
          </template>

          <v-card
            min-width="300"
            max-height="400"
            title="Preview Image"
            class="rounded-lg"
          >
            <v-card-text v-if="hasImage">
              <v-img
                :src="value.imageUrls[0]"
                aspect-ratio="1.5"
                cover
                class="rounded"
                @error="onImageError"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div> </template
              ></v-img>
            </v-card-text>
            <v-card-text v-else class="text-center text-medium-emphasis">
              <div class="flex flex-col items-center">
                <v-icon size="200" color="tertiary"
                  >mdi-image-size-select-actual</v-icon
                >
                Gambar tidak tersedia
              </div>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-btn
          color="error"
          variant="flat"
          size="25"
          icon
          @click="tiles3dStore.popUpBuildingBuilding = false"
        >
          <v-icon size="15">mdi-close</v-icon>
        </v-btn>
      </template>
      <v-card-text class="overflow-y-auto max-h-[400px]">
        <AppTableHorizontal
          :headers="buildingViewerConstant.detailBuildingHeader"
          :values="value"
          :loading="tiles3dStore.attrLoading"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts" setup>
import buildingViewerConstant from "~/app/constant/view/buildingViewer.constant";
import {
  BuildingConstruction,
  BuildingFloorType,
  BuildingType,
  BuildingUpdate,
  BuildingWall,
  RoofType,
} from "~/app/types/enums/building";
const BuildingTypeLabel: Record<BuildingType, string> = {
  RESIDENTIAL: "Perumahan",
  PRIVATE_OFFICE: "Perkantoran Swasta",
  FACTORY: "Pabrik",
  STORE_APOTHECARY_MARKET_RUKO: "Toko/Apotek/Pasar/Ruko",
  HOSPITAL_CLINIC: "Rumah Sakit/Klinik",
  SPORTS_RECREATION: "Olahraga/Rekreasi",
  HOTEL: "Hotel/Wisma",
  WORKSHOP_WAREHOUSE_FARM: "Bengkel/Gudang/Pertanian",
  GOVERNMENT_BUILDING: "Gedung Pemerintah",
  SCHOOL: "Gedung Sekolah",
  OTHER: "Lain-lain",
};

const BuildingConstructionLabel: Record<BuildingConstruction, string> = {
  STEEL: "Baja",
  CONCRETE: "Beton",
  BRICK: "Batu Bata",
  WOOD: "Kayu",
};

const BuildingWallLabel: Record<BuildingWall, string> = {
  GLASS_ALUMINUM: "Kaca/Alumunium",
  CONCRETE: "Beton",
  CONBLOC_BRICK: "Batu Bata Conbloc",
  WOOD: "Kayu",
  CORRUGATED_METAL: "Seng",
};

const BuildingFloorTypeLabel: Record<BuildingFloorType, string> = {
  MARBLE: "Marmer",
  CERAMIC: "Keramik",
  TERRAZZO: "Teraso",
  CONCRETE_TILE: "Ubin PC/Papan",
  CEMENT: "Semen",
};

const BuildingUpdateLabel: Record<BuildingUpdate, string> = {
  ACCURATE: "Sudah Tepat",
  NEW: "Baru",
  NON_PERMANENT: "Bukan Bangunan Permanen",
};

const RoofTypeLabel: Record<RoofType, string> = {
  Genteng: "Genteng",
  Galvalum: "Galvalum",
  Asbes: "Asbes",
  Seng: "Seng",
};
const labelMappings = {
  update: BuildingUpdateLabel,
  buildingType: BuildingTypeLabel,
  buildingConstruction: BuildingConstructionLabel,
  buildingWall: BuildingWallLabel,
  buildingFloorType: BuildingFloorTypeLabel,
  roofType: RoofTypeLabel,
};

const tiles3dStore = use3dTilesStore();

const popUpBuilding: any = computed(() => {
  return tiles3dStore.popUpBuildingBuilding;
});

function applyMapping(
  obj: Record<string, any>,
  mappings: Record<string, Record<string, string>>
) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      mappings[key]?.[value] ?? value,
    ])
  );
}

const value: any = computed(() => {
  const data: any = tiles3dStore.buildingAttribute;
  return applyMapping(data, labelMappings);
});
const imageSrc = ref(value.value.imageUrls?.[0] || "");
const imageFailed = ref(false);

watch(
  () => value.value.imageUrls?.[0],
  (newUrl) => {
    imageSrc.value = newUrl || "";
    imageFailed.value = false;
  },
  { immediate: true }
);
const hasImage = computed(() => {
  return imageSrc.value && !imageFailed.value;
});

function onImageError() {
  imageFailed.value = true;
}
</script>
