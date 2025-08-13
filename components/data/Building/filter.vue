<template>
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
        <AppInputAutocomplete
          v-model="buildingStore.readBuildingData.filterData.buildingType"
          label="Tipe Bangunan"
          :items="buildingTypeOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
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

      <v-col cols="auto">
        <AppButton color="tertiary" label="Filter" @click="filterLandParcel" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import {
  buildingTypeMap,
  buildingUpdateMap,
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
const kelurahanOption = [
  { title: "Lok Tuan", value: "Loktuan" },
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
