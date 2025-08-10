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
      {{ floorTypeMap[item.buildingFloorType] }}
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
import {
  wallTypeMap,
  floorTypeMap,
  buildingTypeMap,
  buildingUpdateMap,
} from "~/app/constant/data/buildingMapping.constant";
const buildingStore = useBuildingDataStore();
const addBuildingSurvey = () => {
  navigateTo("/data/add_building");
};
</script>
