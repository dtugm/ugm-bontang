<template>
  <AppTableData
    title="Data Bangunan Boba"
    :read-data="buildingStore.readLotSurveyData"
  />
</template>
<script setup lang="ts">
const buildingStore = useBuildingDataStore();
</script>
