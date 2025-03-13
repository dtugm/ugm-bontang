<template>
  <v-row>
    <v-col cols="12" lg="4">
      <AppCardGabunganProgress :items="BontangBaru" color="tertiary" />
    </v-col>
    <v-col cols="12" lg="4">
      <AppCardGabunganProgress :items="Loktuan" color="secondary"
    /></v-col>
    <v-col cols="12" lg="4">
      <AppCardGabunganProgress :items="ApiApi" color="success" />
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
const surveyStore = useSurveyStore();
const BontangBaru = ref([
  {
    title: "Bidang Tanah Bontang Baru",
    total: 0,
    from: 3121,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Bontang Baru",
    total: 0,
    from: 5043,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);

const Loktuan = ref([
  {
    title: "Bidang Tanah Loktuan",
    total: 0,
    from: 3597,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Loktuan",
    total: 0,
    from: 5290,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);

const ApiApi = ref([
  {
    title: "Bidang Tanah Api Api",
    total: 0,
    from: 3447,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Api Api",
    total: 0,
    from: 4999,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);
const fetchData = async () => {
  const geoJsonBontangBaru = await fetch(
    "/SurveyPbb/peta_kerja_bontang_baru.geojson"
  );
  const geoJsonBangunan = await fetch(
    "/SurveyPbb/bangunan_bontang_baru.geojson"
  );
  const bidangBontangBaru = await geoJsonBontangBaru.json();
  const bangunanBontangBaru = await geoJsonBangunan.json();
  await surveyStore.getAllUpdatedFeature();
  BontangBaru.value[0].total = surveyStore.bidangTanahData.length;
  BontangBaru.value[0].from = bidangBontangBaru.features.length;
  BontangBaru.value[1].from = bangunanBontangBaru.features.length;
};
onMounted(() => {
  fetchData();
});
</script>
