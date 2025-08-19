<template>
  <AppCardProgressCircular
    title="Peta Garis"
    :value="514"
    done-color="success"
    :target-value="514"
  />
</template>
<script lang="ts" setup>
const petaGarisStore = usePetaGarisStore();
</script>
