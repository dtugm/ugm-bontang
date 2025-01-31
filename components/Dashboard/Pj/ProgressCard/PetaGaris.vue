<template>
  <AppCardProgressCircular
    title="Peta Garis"
    :value="50"
    done-color="primary"
    :target-value="514"
  />
</template>
<script lang="ts" setup>
const petaGarisStore = usePetaGarisStore();
onMounted(async () => {
  petaGarisStore.queryAll();
});
</script>
