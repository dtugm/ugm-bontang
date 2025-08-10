<template>
  <v-menu :close-on-content-click="false" location="left">
    <template v-slot:activator="{ props }">
      <v-btn color="tertiary" v-bind="props" class="text-none" icon>
        <v-icon>mdi-office-building</v-icon></v-btn
      >
    </template>
    <v-card class="rounded-lg">
      <v-card-text>
        <div class="flex flex-col">
          <p class="text-grey">3D Object</p>
          <div class="flex">
            <v-checkbox v-model="viewerStore.isBuildingActive" hide-details>
              <template #label>
                <v-icon color="tertiary">mdi-home-city</v-icon>
              </template>
            </v-checkbox>
            <v-checkbox disabled hide-details>
              <template #label>
                <v-icon color="tertiary">mdi-palm-tree</v-icon>
              </template>
            </v-checkbox>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
const viewerStore = useViewerLandParcelStore();
</script>
