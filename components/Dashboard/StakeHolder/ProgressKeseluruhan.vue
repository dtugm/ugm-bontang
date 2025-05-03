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
        :total="193"
        :from="499"
        unit="RT"
        icon="mdi-cube-outline"
        color="secondary"
    /></v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pembuatan 3D Models LOD 2"
        :total="65"
        :from="499"
        unit="RT"
        icon="mdi-cube-outline"
        color="secondary"
    /></v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        :loading="surveyStore.isFetchingData"
        title="Pelaksanaan Survey PBB"
        :total="3060"
        :from="12053"
        unit="Features"
        icon="mdi-earth"
        color="success"
      />
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
const surveyStore = useSurveyStore();
</script>
