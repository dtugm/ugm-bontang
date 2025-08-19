<template>
  <v-menu :close-on-content-click="false" location="left">
    <template v-slot:activator="{ props }">
      <v-btn color="tertiary" v-bind="props" class="text-none" icon>
        <v-icon>mdi-map</v-icon></v-btn
      >
    </template>

    <v-card class="rounded-lg">
      <v-card-text>
        <p class="text-grey pb-1">Base Map Layer</p>
        <v-radio-group
          v-model="viewerStore.layer"
          hide-details
          inline
          class="pb-4"
        >
          <v-radio value="osm">
            <template #label>
              <v-row align="center" no-gutters>
                <v-img
                  src="/logo/osm.png"
                  width="34"
                  height="34"
                  class="mr-2"
                  cover
                  eager
                />
                <span>OSM</span>
              </v-row>
            </template>
          </v-radio>

          <v-radio value="arcgis">
            <template #label>
              <v-row align="center" no-gutters>
                <v-img
                  src="/logo/world_image.png"
                  width="34"
                  height="34"
                  class="mr-2"
                  cover
                />
                <span>ArcGis</span>
              </v-row>
            </template>
          </v-radio>
        </v-radio-group>
        <hr />
        <p class="text-grey pt-3">Orthophoto</p>
        <v-checkbox v-model="viewerStore.orthoPhoto" hide-details>
          <template #label>
            <v-row align="center" no-gutters>
              <v-img
                src="/logo/ortho.png"
                width="34"
                height="34"
                class="mr-2 full-opacity"
                cover
              />
              <span>Orthophoto</span>
            </v-row>
          </template>
        </v-checkbox>
        <p class="text-grey pt-3">Peta Garis</p>
        <v-checkbox v-model="viewerStore.petaGaris" hide-details>
          <template #label>
            <v-row align="center" no-gutters>
              <v-img
                src="/logo/petaGaris.png"
                width="34"
                height="34"
                class="mr-2 full-opacity"
                cover
              />
              <span>Peta Garis</span>
            </v-row>
          </template>
        </v-checkbox>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
const viewerStore = use3dTilesStore();
</script>
