<template>
  <v-list nav class="h-[calc(100vh-124px-100px)]" lines="two">
    <v-list-item
      v-for="(item, index) in employee"
      :key="index"
      :title="item.name"
      @click=""
    >
      <template #subtitle>
        {{ leaderBoard[item.id] }}/{{ item.hasil }}
        <v-progress-linear
          color="primary"
          :model-value="(leaderBoard[item.id] / item.hasil) * 100"
          :height="10"
          rounded
        >
          <template v-slot:default="{ value }">
            <strong>{{ isNaN(value) ? 0 : Math.ceil(value) }}%</strong>
          </template></v-progress-linear
        >
      </template>
    </v-list-item>
  </v-list>
</template>
<script lang="ts" setup>
import appMock from "~/app/mock/app.mock";
const employee: any = appMock.employee;
const petaGarisStore = usePetaGarisStore();
const leaderBoard: any = computed(() => {
  return petaGarisStore.leaderBoard;
});
</script>
