<template>
  <v-row>
    <v-col cols="12" lg="3">
      <AppTextH2> Progress Dashboard </AppTextH2>
    </v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pembuatan Peta Garis"
        :total="422"
        :from="514"
        unit="Grid"
        icon="mdi-map"
        color="tertiary"
      />
    </v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pembuatan 3D Models"
        :total="528"
        :from="4497"
        unit="Grid"
        icon="mdi-cube-outline"
        color="secondary"
    /></v-col>
    <v-col cols="12" lg="3">
      <AppCardSimpleProgress
        title="Pelaksanaan Survey PBB"
        :total="surveyStore.bidangTanahData.length"
        :from="10165"
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
