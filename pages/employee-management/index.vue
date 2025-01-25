<template>
  <v-data-table :items="pembagian"> </v-data-table>
</template>
<script lang="ts" setup>
import petaGarisMock from "~/app/mock/petaGaris.mock";
const pembagian = petaGarisMock.pembagianArea;
</script>
