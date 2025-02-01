<template>
  <AppCardProgressCircular
    title="3d Models"
    :value="petaGarisStore.totalGrid"
    done-color="info"
    :target-value="514"
  />
</template>
<script lang="ts" setup>
const petaGarisStore = usePetaGarisStore();
</script>
