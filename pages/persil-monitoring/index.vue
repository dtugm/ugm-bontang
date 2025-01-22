<template>
  <LMap
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
    <LGeoJson
      v-if="surveyStore.refreshPersil"
      :geojson="geojson"
      :options-style="geoStyler"
      :key="geojsonKey"
    />
  </LMap>
</template>

<script setup>
import { ref } from "vue";
const geojson = ref(undefined);
const batas = ref(undefined);
const zoom = ref(14);
const surveyStore = useSurveyStore();
const geoStyler = (feature) => ({
  fillColor: checkFeature(feature) ? "green" : "rgba(0, 0, 0, 0)",
  fillOpacity: 1,
});
const geojsonKey = ref(0);
onMounted(async () => {
  const response = await fetch("/Bontang_web.geojson");
  const batasBontang = await fetch("/new_bontang.geojson");
  geojson.value = await response.json();
  batas.value = await batasBontang.json();
});

function checkFeature(feature) {
  return surveyStore.persilStatus.some(
    (item) => item.D_NOP === feature.properties.D_NOP && item.status === true
  );
}
</script>
