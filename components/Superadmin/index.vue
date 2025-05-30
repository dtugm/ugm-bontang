<template>
  <AppTableBasic
    :items="landParcelStore.landParcelItems"
    :headers="persilTableHeader"
    title="List Persil"
  />
  <AppTableData :read-data="landDataStore.readLotSurveyData" />
</template>
<script setup lang="ts">
const persilTableHeader = [
  { title: "No", key: "no" },
  { title: "Name", key: "name" },
  { title: "Type", key: "type" },
  { title: "Category", key: "category" },
  { title: "Status", key: "isActive" },
  { title: "Created At", key: "updatedAt" },
  { title: "Updated At", key: "createdAt" },
  { title: "Actions", key: "action" },
];
const landParcelStore = useLandVectors();
const landDataStore = useLandDataStore();
landParcelStore.getLandParcel({ category: "land_parcel" });
</script>
