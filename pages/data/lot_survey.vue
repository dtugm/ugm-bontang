<template>
  <SuperadminUpload />
  <AppTableData :read-data="landDataStore.readLotSurveyData" />
</template>
<script lang="ts" setup>
import { SuperadminUpload } from "#components";

const landDataStore = useLandDataStore();
</script>
