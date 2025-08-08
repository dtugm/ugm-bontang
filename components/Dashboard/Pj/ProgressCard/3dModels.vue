<template>
  <v-btn block class="mb-1" @click="goTo3D">View 3D</v-btn>
  <AppCardProgressCircular
    title="3d Models (By RT)"
    :value="499"
    done-color="info"
    :target-value="499"
  />
</template>
<script lang="ts" setup>
// const petaGarisStore = usePetaGarisStore();
import { useRouter } from "vue-router";

const router = useRouter();

function goTo3D() {
  router.push("/cesium");
}
</script>
