<template>
  <v-menu v-model="menuOpen" :close-on-content-click="false" location="left">
    <template v-slot:activator="{ props }">
      <v-btn color="tertiary" v-bind="props" class="text-none" icon>
        <v-icon>mdi-table</v-icon></v-btn
      >
    </template>
    <v-card class="rounded-lg">
      <!-- Tabs -->
      <v-tabs v-model="tab" align-tabs="center" color="primary">
        <v-tab value="land">Land Parcel</v-tab>
        <v-tab value="building">Building</v-tab>
      </v-tabs>

      <!-- Window -->
      <v-window v-model="tab">
        <v-window-item value="land">
          <v-card-text>
            <DataLandParcelTable />
          </v-card-text>
        </v-window-item>

        <v-window-item value="building">
          <v-card-text>
            <DataBuildingTable />
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-menu>
</template>
<script lang="ts" setup>
const menuOpen = ref(false);
const tab = ref("land");
provide("closeMenu", () => {
  menuOpen.value = false;
});
</script>
