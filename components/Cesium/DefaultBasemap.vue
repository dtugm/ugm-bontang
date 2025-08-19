<template>
  <vc-layer-imagery v-if="tiles3dStore.orthoPhoto">
    <vc-imagery-provider-urltemplate
      ref="provider"
      url="https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/orthoBontangFull/{z}/{x}/{reverseY}.png"
    ></vc-imagery-provider-urltemplate>
  </vc-layer-imagery>
  <vc-layer-imagery v-if="tiles3dStore.petaGaris">
    <vc-imagery-provider-urltemplate
      ref="provider"
      url="https://digital-twin-ugm.s3.ap-southeast-1.amazonaws.com/petaGarisBontang/{z}/{x}/{reverseY}.png"
    ></vc-imagery-provider-urltemplate>
  </vc-layer-imagery>
  <vc-layer-imagery v-if="tiles3dStore.layer == 'arcgis'">
    <vc-imagery-provider-arcgis :alpha="1"></vc-imagery-provider-arcgis>
  </vc-layer-imagery>
  <vc-layer-imagery v-if="tiles3dStore.layer == 'osm'">
    <vc-imagery-provider-osm />
  </vc-layer-imagery>
</template>

<script setup lang="ts">
const tiles3dStore = use3dTilesStore();
</script>
