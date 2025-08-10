<template>
  <AppTableData
    title="Data Bangunan Boba"
    :read-data="buildingStore.readLotSurveyData"
  >
    <template #action>
      <div class="flex gap-1">
        <AppButton
          variant="outlined"
          label="Add Building"
          @click="addBuildingSurvey"
        />
      </div>
    </template>

    <template
      #item.buildingFloorType="{
        item,
      }: {
        item: { buildingFloorType: BuildingFloorType },
      }"
    >
      {{ floorType[item.buildingFloorType] }}
    </template>
    <template
      #item.buildingType="{ item }: { item: { buildingType: BuildingType } }"
    >
      {{ buildingTypeMap[item.buildingType] }}
    </template>
    <template #item.update="{ item }: { item: { update: BuildingUpdate } }">
      {{ buildingUpdateMap[item.update] }}
    </template>
    <template
      #item.buildingWall="{ item }: { item: { buildingWall: BuildingWall } }"
    >
      {{ wallTypeMap[item.buildingWall] }}
    </template>
  </AppTableData>
</template>
<script setup lang="ts">
import {
  BuildingFloorType,
  BuildingUpdate,
  BuildingType,
  BuildingWall,
} from "~/app/types/enums/building";
const floorType: Record<BuildingFloorType, string> = {
  [BuildingFloorType.MARBLE]: "Marmer",
  [BuildingFloorType.CERAMIC]: "Keramik",
  [BuildingFloorType.TERRAZZO]: "Teraso",
  [BuildingFloorType.CONCRETE_TILE]: "Ubin PC/Papan",
  [BuildingFloorType.CEMENT]: "Semen",
};

const buildingTypeMap: Record<BuildingType, string> = {
  [BuildingType.RESIDENTIAL]: "Perumahan",
  [BuildingType.PRIVATE_OFFICE]: "Perkantoran Swasta",
  [BuildingType.FACTORY]: "Pabrik",
  [BuildingType.STORE_APOTHECARY_MARKET_RUKO]: "Toko / Apotek / Pasar / Ruko",
  [BuildingType.HOSPITAL_CLINIC]: "Rumah Sakit / Klinik",
  [BuildingType.SPORTS_RECREATION]: "Olahraga / Rekreasi",
  [BuildingType.HOTEL]: "Hotel / Wisma",
  [BuildingType.WORKSHOP_WAREHOUSE_FARM]: "Bengkel / Gudang / Pertanian",
  [BuildingType.GOVERNMENT_BUILDING]: "Gedung Pemerintah",
  [BuildingType.SCHOOL]: "Gedung Sekolah",
  [BuildingType.OTHER]: "Lain-lain",
};

const buildingUpdateMap: Record<BuildingUpdate, string> = {
  [BuildingUpdate.ACCURATE]: "Sudah Tepat",
  [BuildingUpdate.NEW]: "Bangunan Baru",
  [BuildingUpdate.NON_PERMANENT]: "Bukan Bangunan Permanen",
};
const wallTypeMap: Record<BuildingWall, string> = {
  [BuildingWall.CONBLOC_BRICK]: "Batu Bata Conbloc",
  [BuildingWall.CONCRETE]: "Beton",
  [BuildingWall.CORRUGATED_METAL]: "Seng",
  [BuildingWall.GLASS_ALUMINUM]: "Kaca/Alumunium",
  [BuildingWall.WOOD]: "Kayu",
};
const buildingStore = useBuildingDataStore();
const addBuildingSurvey = () => {
  navigateTo("/data/add_building");
};
</script>
