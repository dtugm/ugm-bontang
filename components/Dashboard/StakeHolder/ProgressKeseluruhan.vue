<template>
  <v-row>
    <!-- <v-col cols="12" lg="3">
      <AppTextH2> Progress Dashboard </AppTextH2>
    </v-col> -->
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pembuatan Peta Garis"
        :total="444"
        :from="514"
        unit="Grid"
        icon="mdi-map"
        color="tertiary"
      />
    </v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pembuatan 3D Models LOD 1"
        :total="499"
        :from="499"
        unit="RT"
        icon="mdi-cube-outline"
        color="secondary"
    /></v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pembuatan 3D Models LOD 2"
        :total="499"
        :from="499"
        unit="RT"
        icon="mdi-cube-outline"
        color="secondary"
    /></v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        :loading="surveyStore.isFetchingData"
        title="Pelaksanaan Survey PBB"
        :total="total"
        :from="target"
        unit="Features"
        icon="mdi-earth"
        color="success"
      />
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import landParcelConstant from "~/app/constant/landParcel.constant";
const surveyStore = useSurveyStore();
const total = computed(() => {
  return (
    landParcelConstant.actual.bidang.boba +
    landParcelConstant.actual.bidang.apiapi +
    landParcelConstant.actual.bidang.loktuan
  );
});
const target = computed(() => {
  return (
    landParcelConstant.target.bidang.boba +
    landParcelConstant.target.bidang.apiapi +
    landParcelConstant.target.bidang.loktuan
  );
});
</script>
