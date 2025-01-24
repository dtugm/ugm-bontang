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
    <LTileLayer
      :url="`https://api.maptiler.com/tiles/de87de13-5b83-4e8c-92fd-448138e0799f/{z}/{x}/{y}.jpg?key=${API_KEY}`"
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
import { collection, getFirestore } from "firebase/firestore";
const geojson = ref(undefined);
const batas = ref(undefined);
const zoom = ref(14);
const db = getFirestore();
const surveyStore = useSurveyStore();
const geoStyler = (feature) => ({
  fillColor: checkFeature(feature) ? "green" : "rgba(0, 0, 0, 0)",
  fillOpacity: 1,
});
const geojsonKey = ref(0);
const API_KEY = useRuntimeConfig().public.mapTilesKey;
onMounted(async () => {
  const response = await fetch("/Bontang_web.geojson");
  const batasBontang = await fetch("/new_bontang.geojson");
  geojson.value = await response.json();
  batas.value = await batasBontang.json();
});
const surveyProgress = useCollection(collection(db, "surveyProgress"));
function checkFeature(feature) {
  return surveyProgress.value.some(
    (item) => item.D_NOP === feature.properties.D_NOP && item.status === true
  );
}
</script>
