<script setup>
import maplibregl from "maplibre-gl";
import { onMounted } from "vue";
import landParcelConstant from "~/app/constant/landParcel.constant";
const surveyStore = useSurveyStore();
onMounted(() => {
  // Inisialisasi peta
  const map = new maplibregl.Map({
    container: "map", // id dari element div
    style: "https://demotiles.maplibre.org/style.json", // style peta
    center: [106.8456, -6.2088], // longitude, latitude (Jakarta sebagai contoh)
    zoom: 12, // level zoom
  });

  // Tambahkan kontrol navigasi (zoom in/out)
  map.addControl(new maplibregl.NavigationControl(), "top-right");

  // Tambahkan marker sebagai contoh
  new maplibregl.Marker()
    .setLngLat([106.8456, -6.2088])
    .setPopup(new maplibregl.Popup().setHTML("<h3>Jakarta</h3>"))
    .addTo(map);
});

const BontangBaru = ref([
  {
    title: "Bidang Tanah Bontang Baru",
    total: landParcelConstant.actual.bidang.boba,
    from: landParcelConstant.target.bidang.boba,
    unit: "Feature",
  },
  {
    title: "Bangunan Bontang Baru",
    total: landParcelConstant.actual.bangunan.boba,
    from: landParcelConstant.target.bangunan.boba,
    unit: "Feature",
  },
]);

const Loktuan = ref([
  {
    title: "Bidang Tanah Loktuan",
    total: landParcelConstant.actual.bidang.loktuan,
    from: landParcelConstant.target.bidang.loktuan,
    unit: "Feature",
  },
  {
    title: "Bangunan Loktuan",
    total: landParcelConstant.actual.bangunan.loktuan,
    from: landParcelConstant.target.bangunan.loktuan,
    unit: "Feature",
  },
]);
const ApiApi = computed(() => [
  {
    title: "Bidang Tanah Api Api",
    total: landParcelConstant.actual.bidang.apiapi,
    from: landParcelConstant.target.bidang.apiapi,
    unit: "Feature",
  },
  {
    title: "Bangunan Api Api",
    total: landParcelConstant.actual.bangunan.apiapi,
    from: landParcelConstant.target.bangunan.apiapi,
    unit: "Feature",
  },
]);
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <div id="map" style="height: 600px; width: 100%" class="rounded"></div>
        <v-row class="mt-4">
          <v-col cols="12">
            <div class="flex gap-4">
              <AppCardSimpleProgress
                class="flex-1"
                title="Pelaksanaan Survey PBB"
                :total="13687"
                :from="13105"
                unit="Features"
                icon="mdi-earth"
                color="success"
              />
              <AppCardSimpleProgress
                class="flex-1"
                title="Pembuatan Peta Garis"
                :total="514"
                :from="514"
                unit="Grid"
                icon="mdi-map"
                color="tertiary"
              />
            </div>
          </v-col>
          <v-col cols="12">
            <div class="flex gap-4">
              <AppCardSimpleProgress
                class="flex-1"
                title="Pembuatan 3D Models LOD 1"
                :total="499"
                :from="499"
                unit="RT"
                icon="mdi-cube-outline"
                color="secondary"
              />
              <AppCardSimpleProgress
                class="flex-1"
                title="Pembuatan 3D Models LOD 2"
                :total="499"
                :from="499"
                unit="RT"
                icon="mdi-cube-outline"
                color="secondary"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="flex flex-col gap-4">
        <AppCardGabunganProgress
          color="tertiary"
          :items="BontangBaru"
          class="flex-1"
        />
        <AppCardGabunganProgress
          color="secondary"
          :items="ApiApi"
          class="flex-1"
        />
        <AppCardGabunganProgress
          color="success"
          :items="Loktuan"
          class="flex-1"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
