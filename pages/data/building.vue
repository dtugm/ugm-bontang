<template>
  <DataBuildingFilter />
  <AppTableData
    placeholder="Search By NOP"
    title="Data Bangunan Boba"
    :read-data="buildingStore.readBuildingData"
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
    <template #item.luasBgn="{ item }">
      <v-chip v-if="Number(item.luasBgn)" color="primary-blue">
        {{ item.luasBgn }} m<sup>2</sup>
      </v-chip>
      <p v-else>to be updated</p>
    </template>
    <template #item.luasBgnBaru="{ item }">
      <v-chip
        density="comfortable"
        v-if="Number(item.luasBgnBaru)"
        color="primary-blue"
      >
        {{ item.luasBgnBaru }} m<sup>2</sup>
      </v-chip>
      <p v-else>to be updated</p>
    </template>
    <template
      #item.buildingFloorType="{
        item,
      }: {
        item: { buildingFloorType: BuildingFloorType },
      }"
    >
      <v-chip
        density="comfortable"
        :color="floorColorMap[item.buildingFloorType]"
      >
        {{ floorTypeMap[item.buildingFloorType] ?? "-" }}
      </v-chip>
    </template>
    <template
      #item.buildingType="{ item }: { item: { buildingType: BuildingType } }"
    >
      <v-chip
        :append-icon="buildingTypeIconMap[item.buildingType]"
        density="comfortable"
        :color="buildingTypeColorMap[item.buildingType]"
      >
        {{ buildingTypeMap[item.buildingType] ?? "-" }}
      </v-chip>
    </template>
    <template #item.update="{ item }: { item: { update: BuildingUpdate } }">
      <v-chip
        density="comfortable"
        :color="buildingUpdateColorMap[item.update]"
      >
        {{ buildingUpdateMap[item.update] ?? "-" }}
      </v-chip>
    </template>
    <template #item.roofType="{ item }: { item: { roofType: RoofType } }">
      <v-chip density="comfortable" :color="roofTypeColorMap[item.roofType]">
        {{ item.roofType ?? "-" }}
      </v-chip>
    </template>
    <template
      #item.buildingWall="{ item }: { item: { buildingWall: BuildingWall } }"
    >
      <v-chip
        density="comfortable"
        :color="wallTypeColorMap[item.buildingWall]"
      >
        {{ wallTypeMap[item.buildingWall] ?? "-" }}
      </v-chip>
    </template>
  </AppTableData>
</template>
<script setup lang="ts">
import {
  BuildingFloorType,
  BuildingUpdate,
  BuildingType,
  BuildingWall,
  RoofType,
} from "~/app/types/enums/building";
import {
  wallTypeMap,
  floorTypeMap,
  buildingTypeMap,
  buildingUpdateMap,
  floorColorMap,
  buildingTypeColorMap,
  buildingUpdateColorMap,
  wallTypeColorMap,
  roofTypeColorMap,
  buildingTypeIconMap,
} from "~/app/constant/data/buildingMapping.constant";
const buildingStore = useBuildingDataStore();
const addBuildingSurvey = () => {
  navigateTo("/data/add_building");
};
</script>
