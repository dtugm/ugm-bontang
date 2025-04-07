<template>
  <v-container fluid class="h-full">
    <v-data-table :items="vectorStore.geoJsonItems"> </v-data-table>
  </v-container>
</template>
<script lang="ts" setup>
const vectorStore = useVectorsStore();
vectorStore.getAllGeoJson();
</script>
