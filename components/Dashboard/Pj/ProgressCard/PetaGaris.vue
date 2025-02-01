<template>
  <AppCardProgressCircular
    title="Peta Garis"
    :value="petaGarisStore.totalGrid"
    done-color="primary"
    :target-value="514"
  />
</template>
<script lang="ts" setup>
const petaGarisStore = usePetaGarisStore();
</script>
