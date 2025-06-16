<template>
  <AppTableData :read-data="landDataStore.readLotSurveyData" />
</template>
<script lang="ts" setup>
const landDataStore = useLandDataStore();
</script>
