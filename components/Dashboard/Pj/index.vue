<template>
  <v-container class="h-full">
    <v-row align="stretch" class="h-[20%]">
      <v-col cols="12" sm="4">
        <v-sheet height="100" color="grey"></v-sheet>
      </v-col>
      <v-col cols="12" sm="4">
        <v-sheet height="100" color="grey"></v-sheet>
      </v-col>
      <v-col cols="12" sm="4">
        <v-sheet height="100" color="grey"></v-sheet>
      </v-col>
    </v-row>
    <v-row class="h-[80%]">
      <v-col cols="12" sm="9" class="h-full">
        <v-card class="h-full overflow-scroll">
          <v-data-table :items="pembagian"> </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <v-sheet height="100" color="grey"></v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import petaGarisMock from "~/app/mock/petaGaris.mock";
const pembagian = petaGarisMock.pembagianArea;
</script>
