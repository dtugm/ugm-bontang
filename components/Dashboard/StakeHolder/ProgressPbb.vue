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
        <!-- <template #overlay>
          <v-overlay
            v-model="overlay"
            absolute
            class="align-center justify-center"
            contained
          >
            Start Survey in May 2025
          </v-overlay>
        </template> -->
      </AppCardGabunganProgress>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import landParcelConstant from "~/app/constant/landParcel.constant";
const overlay = ref(true);
const surveyStore = useSurveyStore();
const landParcelStore = useLandVectors();
const buildingStore = useBuildingVectors();

const isFetchingData = ref(false);
const BontangBaru = ref([
  {
    title: "Bidang Tanah Bontang Baru",
    total: landParcelConstant.actual.bidang.boba,
    from: landParcelConstant.target.bidang.boba,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Bontang Baru",
    total: landParcelConstant.actual.bangunan.boba,
    from: landParcelConstant.target.bangunan.boba,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);

const Loktuan = ref([
  {
    title: "Bidang Tanah Loktuan",
    total: landParcelConstant.actual.bidang.loktuan,
    from: landParcelConstant.target.bidang.loktuan,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Loktuan",
    total: landParcelConstant.actual.bangunan.loktuan,
    from: landParcelConstant.target.bangunan.loktuan,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);

const ApiApi = computed(() => [
  {
    title: "Bidang Tanah Api Api",
    total: landParcelConstant.actual.bidang.apiapi,
    from: landParcelConstant.target.bidang.apiapi,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
  {
    title: "Bangunan Api Api",
    total: landParcelConstant.actual.bangunan.apiapi,
    from: landParcelConstant.target.bangunan.apiapi,
    unit: "Feature",
    icon: "mdi-folder-information-outline",
  },
]);
// const get;
// const fetchData = async () => {
//   isFetchingData.value = true;
//   const geoJsonBontangBaru = await fetch(
//     "/SurveyPbb/peta_kerja_bontang_baru.geojson"
//   );
//   const geoJsonBangunan = await fetch(
//     "/SurveyPbb/bangunan_bontang_baru.geojson"
//   );
//   const geoJsonBangunanDone = await fetch(
//     "/SurveyPbb/building_bontang_baru_progress.geojson"
//   );
//   const bidangBontangBaru = await geoJsonBontangBaru.json();
//   const bangunanBontangBaru = await geoJsonBangunan.json();
//   const bangunanBontangBaruDone = await geoJsonBangunanDone.json();
//   await surveyStore.getAllUpdatedFeature();
//   // BontangBaru.value[0].total = surveyStore.bidangTanahData.length;
//   // BontangBaru.value[0].from = bidangBontangBaru.features.length;
//   // BontangBaru.value[1].total = bangunanBontangBaruDone.features.length;
//   BontangBaru.value[1].from = bangunanBontangBaru.features.length;
//   isFetchingData.value = false;
// };
// onMounted(() => {
//   fetchData();
// });
</script>
