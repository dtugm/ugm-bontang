<template>
  <AppTableData
    title="Data Bangunan Boba"
    :read-data="buildingStore.readLotSurveyData"
  >
    <template #action>
      <div class="flex gap-1">
        <AppButton
          variant="outlined"
          label="Add Building"
          @click="addBuildingSurvey"
        />
      </div>
      <!-- <v-btn @click="testFunction()">Test</v-btn> -->
    </template>
  </AppTableData>
</template>
<script setup lang="ts">
const buildingStore = useBuildingDataStore();
const addBuildingSurvey = () => {
  navigateTo("/data/add_building");
};
</script>
