<template>
  <AppCardProgressCircular
    title="Survey PBB"
    :value="petaGarisStore.totalGrid"
    :target-value="13000"
  />
</template>
<script lang="ts" setup>
const petaGarisStore = usePetaGarisStore();
onMounted(async () => {
  petaGarisStore.queryAll();
});
</script>
