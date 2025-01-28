<template>
  <LeafletTestOrtho />
  <!-- <LMap
    ref="map"
    style="height: 100vh"
    :zoom="zoom"
    :center="[0.12505772302512846, 117.48004699561473]"
    :use-global-leaflet="false"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    />
    <LGeoJson :geojson="area" :options-style="geoStyler" :key="geojsonKey" />
    <LGeoJson
      :geojson="grid"
      :options-style="geoStylerGrid"
      :key="geojsonKey"
    />
  </LMap> -->
</template>

<script setup>
import { ref } from "vue";
import petaGarisConstant from "~/app/constant/petaGaris.constant";
import { collection, getFirestore } from "firebase/firestore";
const areaColors = petaGarisConstant.areaColors;
const petaGarisStore = usePetaGarisStore();
const area = ref(undefined);
const grid = ref(undefined);
const zoom = ref(14);
const geoStyler = (feature) => ({
  color: areaColors[feature.properties.bagi_18],
  fillOpacity: 0.7,
  opacity: 1,
});
onMounted(async () => {
  await petaGarisStore?.queryAll();
  const response = await fetch("/AREA_PETA_GARIS.geojson");
  area.value = await response.json();
  const responseGrid = await fetch("/GRID_PETA_GARIS.geojson");
  grid.value = await responseGrid.json();
  isGeojsonView.value = true;
});
const geoStylerGrid = (feature) => ({
  fillColor:
    Array.isArray(petaGarisStore?.totalArray) &&
    totalArray.some(
      (item) =>
        item.GRID === feature?.properties?.GRID && // Pastikan GRID ada
        Number(item.bagi_18) === feature?.properties?.bagi_18 // Pastikan bagi_18 ada
    )
      ? "green"
      : "rgba(0, 0, 0, 0)",
  fillOpacity: 1,
  color: "yellow",
  opacity: 1,
});
const geojsonKey = ref(0);
// const API_KEY = useRuntimeConfig().public.mapTilesKey
const isGeojsonView = ref(false);

// const surveyProgress = useCollection(collection(db, "surveyProgress"));
// function checkFeature(feature) {
//   return surveyProgress.value.some(
//     (item) => item.D_NOP === feature.properties.D_NOP && item.status === true
//   );
// }
</script>
