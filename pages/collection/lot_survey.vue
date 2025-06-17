<template>
  <AppTableData
    title="Survey Bidang Tanah"
    :read-data="landDataStore.readLotSurveyCollection"
  />
</template>
<script lang="ts" setup>
const landDataStore = useLandDataStore();
</script>
