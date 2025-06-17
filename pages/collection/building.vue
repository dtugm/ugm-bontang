<template>
  <AppTableData
    title="Suvey Bangunan"
    :read-data="buildingStore.readBuldingCollection"
  >
    <template #item.buildingUpdate="{ item }">
      <v-chip density="comfortable" :color="updateColor[item.buildingUpdate]">
        {{ item.buildingUpdate }}
      </v-chip>
    </template>
  </AppTableData>
</template>
<script setup lang="ts">
import kodeConstant from "~/app/constant/kode.constant";
const buildingStore = useBuildingDataStore();
const updateColor: any = kodeConstant.UPDATE_COLOR;
</script>
