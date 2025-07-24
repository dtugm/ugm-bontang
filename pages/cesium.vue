<template>
  <ClientOnly>
    <vc-viewer ref="refViewer" @ready="onViewerReady">
      <vc-layer-imagery>
        <vc-imagery-provider-osm />
      </vc-layer-imagery>
      <!-- <vc-navigation position="top-left"></vc-navigation> -->
      <vc-my-location
        position="top-left"
        :offset="[60, 0]"
        :custom-a-p-i="
          () => ({ lng: 117.4862540730994, lat: 0.16434345896876157 })
        "
      ></vc-my-location>
      <vc-viewer-camera :position="cameraPosition" />
      <!-- <vc-primitive-tileset
        ref="primitive"
        :assetId="96188"
      ></vc-primitive-tileset> -->
      <vc-primitive-tileset
        ref="primitive"
        url="https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/3dtiles/Masjid%20Terapung%20Darul%20Irsyad%20Al%20Muhajirin/tileset.json"
      ></vc-primitive-tileset>
      <vc-primitive-tileset
        v-for="(item, index) in tilesArr"
        :key="index"
        ref="primitive"
        :url="item.url"
        maximumScreenSpaceError="32"
      ></vc-primitive-tileset>
      <vc-terrain-provider-cesium
        ref="provider"
        :assetId="3338372"
      ></vc-terrain-provider-cesium>
      <vc-tileset
        :url="osmUrl"
        maximumScreenSpaceError="2"
        maximumMemoryUsage="512"
      />
    </vc-viewer>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: "viewer",
});
const refViewer = ref(null);
const tiles3dStore = use3dTilesStore();
const tilesArr = ref([]);
const onViewerReady = ({ Cesium, viewer, vm }: any) => {
  viewer.scene.globe.depthTestAgainstTerrain = true;
};
onMounted(async () => {
  const resp = await tiles3dStore.getAll3dTiles();
  console.log(resp);
  tilesArr.value = resp;
});
// Koordinat Jakarta
const cameraPosition = {
  lng: 106.8272, // longitude Jakarta
  lat: -6.1754, // latitude Jakarta
  height: 1500, // dalam meter
};

// Gunakan token Cesium Ion (ganti dengan milikmu)
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhOTlhZjlmZi0yMDM0LTQwNGEtODQ4NS03ZDRkZTUzYWUxMTIiLCJpZCI6MTkwMjU4LCJpYXQiOjE3MjQ3NzM1NzZ9.Kzanw-wRspiVed64_lT34o2ouploxv6JRu0K16WkpgU";
const assetId = 96188; // OSM Buildings

// URL 3D Tileset dari Cesium Ion
const osmUrl = `https://assets.cesium.com/${assetId}/tileset.json?access_token=${accessToken}`;
</script>
