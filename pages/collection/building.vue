<template>
  <AppTableData
    title="Suvey Bangunan"
    :read-data="buildingStore.readBuldingCollection"
  />
</template>
<script setup lang="ts">
const buildingStore = useBuildingDataStore();
</script>
