<template>
  <AppTableBasic :items="landParcelStore.landParcelItems" title="List Persil" />
  <LeafletMap />
</template>
<script setup lang="ts">
const landParcelStore = useLandVectors();
landParcelStore.getLandParcel({ category: "land_parcel" });
</script>
