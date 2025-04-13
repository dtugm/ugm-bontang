<template>
  <v-container class="min-h-screen">
    <v-container class="h-[calc(100vh-32px)] bg-white" fluid>
      <template v-if="memberLidarItem">
        <v-tabs
          v-model="tab"
          color="primary"
          density="compact"
          selected-class="font-weight-bold"
        >
          <v-tab
            v-for="(item, index) in memberLidarItem"
            :key="index"
            :value="item.id"
            class="text-none"
          >
            {{ item?.firstName }} {{ item?.lastName }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item
            v-for="(item, index) in memberLidarItem"
            :key="index"
            :value="item?.id"
          >
            <DashboardLeaderLidarTaskPreview :member="item" />
          </v-window-item>
        </v-window>
      </template>
    </v-container>
  </v-container>
</template>
<script lang="ts" setup>
const tab = ref();

const groupStore = useGroup();
const memberLidarItem = computed(() =>
  groupStore.lidarGroup?.members
    .filter((item: any) => item.role == "MEMBER")
    .map((item: any) => ({
      id: item.id,
      ...item.user,
    }))
);
</script>
