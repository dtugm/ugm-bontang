<template>
  <div class="flex gap-2">
    <v-btn @click="filterTileset" color="primary">Filter Bangunan</v-btn>
    <v-btn @click="showAllTileset" color="primary">Show Bangunan</v-btn>
  </div>
  <v-menu :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn color="indigo" v-bind="props" class="text-none"> </v-btn>
    </template>

    <v-card min-width="300"> sss </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";

const props = defineProps<{
  tileRefs: Cesium.Cesium3DTileset[];
}>();

function filterTileset() {
  const idsToShow = ["BB_15062025-AAAA-04757-GeoAI02-077C3EF"];

  props.tileRefs.forEach((tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);
        const featureId = feature.getProperty("gml:id");

        feature.show = idsToShow.includes(featureId);
      }
    });
  });
}

function showAllTileset() {
  props.tileRefs.forEach((tileset) => {
    tileset.tileVisible.addEventListener(function (tile) {
      const content = tile.content;
      const featuresLength = content.featuresLength;

      for (let i = 0; i < featuresLength; i++) {
        const feature = content.getFeature(i);
        feature.show = true;
      }
    });
  });
}
</script>
