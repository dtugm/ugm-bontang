<template>
  <v-container>
    <v-row>
      <v-col>
        <AppInputAutocomplete
          v-model="landParcelStore.readLandParcel.filterData.village"
          label="Kelurahan"
          :items="kelurahanOption"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="landParcelStore.readLandParcel.filterData.staWpop"
          label="Status Wajib Pajak"
          :items="staWpopOptions"
          is-filter
          hide-details
          clearable
        />
      </v-col>
      <v-col>
        <AppInputAutocomplete
          v-model="landParcelStore.readLandParcel.filterData.landType"
          label="Jenis Tanah"
          :items="landTypeOptions"
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
import { landTypeMap } from "~/app/constant/data/landParcelMapping.constant";
import { STAWPOP } from "~/app/types/enums/landParcel";
const landParcelStore = useLandParcelStore();
const staWpopOptions = Object.values(STAWPOP);
const landTypeOptions = Object.entries(landTypeMap).map(([value, title]) => ({
  value,
  title,
}));

const filterField: any = ref({
  village: null,
  staWpop: null,
  landType: null,
});
const kelurahanOption = [
  { title: "Lok Tuan", value: "Lok Tuan" },
  { title: "Bontang Baru", value: "Bontang Baru" },
  { title: "Api Api", value: "Api api" },
];

const filterLandParcel = async () => {
  landParcelStore.readLandParcel.getData({
    itemsPerPage: 10,
    page: 1,
  });
};
</script>
