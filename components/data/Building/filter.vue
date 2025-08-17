<template>
  <v-col>
    <v-chip color="primary" label>
      Total Building:
      {{ buildingStore.readBuildingData.tableData.totalItems }}
    </v-chip>
  </v-col>
  <v-container>
    <v-row>
      <v-col>
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.village"
          label="Kelurahan"
          :items="kelurahanOption"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputText
          v-model="buildingStore.readBuildingData.filterData.rt"
          label="RT"
          type="number"
          is-filter
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.showBuilding"
          label="Kebaruan Bangunan"
          :items="updateByLuasBangunan"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col cols="auto">
        <AppButton color="tertiary" label="Filter" @click="filterLandParcel" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.update"
          label="Status"
          :items="buildingUpdateOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.buildingType"
          label="Jenis Bangunan"
          :items="buildingTypeOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.buildingFloorType"
          label="Floor Type"
          :items="floorTypeOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.buildingWall"
          label="Wall Type"
          :items="wallTypeOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="
            buildingStore.readBuildingData.filterData.buildingConstruction
          "
          label="Construction Type"
          :items="buildingConstructionTypeOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import {
  buildingConstructionMap,
  buildingTypeMap,
  buildingUpdateMap,
  floorTypeMap,
  wallTypeMap,
} from "~/app/constant/data/buildingMapping.constant";
const buildingStore = useBuildingDataStore();
const buildingTypeOptions = Object.entries(buildingTypeMap).map(
  ([value, title]) => ({
    value,
    title,
  })
);
const buildingUpdateOptions = Object.entries(buildingUpdateMap).map(
  ([value, title]) => ({
    value,
    title,
  })
);
const floorTypeOptions = Object.entries(floorTypeMap).map(([value, title]) => ({
  value,
  title,
}));
const buildingConstructionTypeOptions = Object.entries(
  buildingConstructionMap
).map(([value, title]) => ({
  value,
  title,
}));
const wallTypeOptions = Object.entries(wallTypeMap).map(([value, title]) => ({
  value,
  title,
}));

const updateByLuasBangunan = [
  { title: "Semua Bangunan", value: "Show All" },
  { title: "Bangunan Baru", value: "Show Only New Building" },
  { title: "Bangunan Lama", value: " Show Only Old Building" },
];
const kelurahanOption = [
  { title: "Lok Tuan", value: "Lok Tuan" },
  { title: "Bontang Baru", value: "Bontang Baru" },
  { title: "Api Api", value: "Api api" },
];

const filterLandParcel = async () => {
  buildingStore.readBuildingData.getData({
    itemsPerPage: 10,
    page: 1,
  });
};
</script>
