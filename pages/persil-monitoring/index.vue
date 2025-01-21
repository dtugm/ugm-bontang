<template>
  <div style="height: 100vh; width: 100vw">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="[0.12505772302512846, 117.48004699561473]"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LGeoJson :geojson="geojson" :options-style="geoStyler" />
      <!-- <LGeoJson :geojson="batas" :options-style="geoStyler" /> -->
    </LMap>
  </div>
</template>

<script setup>
import { ref } from "vue";
const geojson = ref(undefined);
const batas = ref(undefined);
const zoom = ref(14);
const geoStyler = (feature) => ({
  fillColor: feature.properties.REMARK ? "green" : "rgba(0, 0, 0, 0)",
  fillOpacity: 1,
});
onMounted(async () => {
  const response = await fetch("/Bontang_web.geojson");
  const batasBontang = await fetch("/new_bontang.geojson");
  const response2 = await fetch(
    "https://rawgit.com/gregoiredavid/france-geojson/master/regions/pays-de-la-loire/communes-pays-de-la-loire.geojson"
  );
  geojson.value = await response.json();
  batas.value = await batasBontang.json();
});
</script>
