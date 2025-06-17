<template>
  <AppTableData
    title="Survey Bidang Tanah"
    :read-data="landDataStore.readLotSurveyCollection"
  >
    <template #item.status="{ item }: any">
      <v-chip :color="statusColor[item.status]" density="comfortable">
        {{ item.status }}
      </v-chip>
    </template>
  </AppTableData>
</template>
<script lang="ts" setup>
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
const statusColor: any = SurveyLapanganConstant.statusColorMap;
const landDataStore = useLandDataStore();
</script>
