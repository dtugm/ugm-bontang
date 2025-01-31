<template>
  <v-card variant="flat">
    <v-tabs v-model="tab" color="secondary" grow>
      <v-tab
        v-for="(item, index) in progressMap"
        :key="index"
        :value="item.value"
        class="text-none"
      >
        <v-icon :icon="item.icon"></v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="peta_garis">
        <DashboardLeaderboardPetaGaris />
      </v-tabs-window-item>
      <v-tabs-window-item value="3d_models">
        <DashboardLeaderboard3dModels />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      tab: "peta_garis",
      progressMap: [
        {
          title: "Peta Garis",
          value: "peta_garis",
          icon: "mdi-map",
        },
        {
          title: "3d Models",
          value: "3d_models",
          icon: "mdi-cube-outline",
        },
      ],
    };
  },
};
</script>
