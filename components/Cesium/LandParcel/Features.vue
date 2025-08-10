<template>
  <div class="absolute top-1/3 -translate-y-1/2 left-5 z-10">
    <div class="flex flex-col gap-2">
      <CesiumLandParcelBaseMapFeature />
      <CesiumLandParcelObjectFeature />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CesiumLandParcelBaseMapFeature } from "#components";

const viewerStore = use3dTilesStore();
</script>
