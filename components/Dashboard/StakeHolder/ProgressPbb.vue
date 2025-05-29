<template>
  <v-row>
    <v-col cols="12" lg="4">
      <AppCardGabunganProgress
        :loading="isFetchingData"
        :items="BontangBaru"
        color="tertiary"
      />
    </v-col>
    <v-col cols="12" lg="4">
      <AppCardGabunganProgress :items="ApiApi" color="secondary">
      </AppCardGabunganProgress
    ></v-col>
    <v-col cols="12" lg="4">
      <AppCardGabunganProgress :items="Loktuan" color="success">
        <template #overlay>
          <v-overlay
            v-model="overlay"
            absolute
            class="align-center justify-center"
            contained
          >
            Start Survey in May 2025
          </v-overlay>
        </template>
      </AppCardGabunganProgress>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
const overlay = ref(true);
const surveyStore = useSurveyStore();
const landParcelStore = useLandVectors();
const buildingStore = useBuildingVectors();
const isFetchingData = ref(false);
const BontangBaru = ref([
  {
    title: "Bidang Tanah Bontang Baru",
    total: 3060,
    from: 3237,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Bontang Baru",
    total: 3699,
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

const ApiApi = computed(() => [
  {
    title: "Bidang Tanah Api Api",
    total: landParcelStore.totalLandParcelCounts,
    from: 5219,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Api Api",
    total: buildingStore.totalBuildingCounts,
    from: 5496,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);
const fetchData = async () => {
  isFetchingData.value = true;
  const geoJsonBontangBaru = await fetch(
    "/SurveyPbb/peta_kerja_bontang_baru.geojson"
  );
  const geoJsonBangunan = await fetch(
    "/SurveyPbb/bangunan_bontang_baru.geojson"
  );
  const geoJsonBangunanDone = await fetch(
    "/SurveyPbb/building_bontang_baru_progress.geojson"
  );
  const bidangBontangBaru = await geoJsonBontangBaru.json();
  const bangunanBontangBaru = await geoJsonBangunan.json();
  const bangunanBontangBaruDone = await geoJsonBangunanDone.json();
  await surveyStore.getAllUpdatedFeature();
  // BontangBaru.value[0].total = surveyStore.bidangTanahData.length;
  // BontangBaru.value[0].from = bidangBontangBaru.features.length;
  // BontangBaru.value[1].total = bangunanBontangBaruDone.features.length;
  BontangBaru.value[1].from = bangunanBontangBaru.features.length;
  isFetchingData.value = false;
};
onMounted(() => {
  fetchData();
});
</script>
