<template>
  <v-container class="min-h-screen">
    <v-container class="h-[calc(100vh-32px)] bg-white" fluid>
      <template v-if="memberModelGroup">
        <v-tabs
          v-model="tab"
          color="primary"
          density="compact"
          selected-class="font-weight-bold"
        >
          <v-tab
            v-for="(item, index) in memberModelGroup"
            :key="index"
            :value="item.id"
            class="text-none"
          >
            {{ item?.firstName }} {{ item?.lastName }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item
            v-for="(item, index) in memberModelGroup"
            :key="index"
            :value="item?.id"
          >
            <DashboardLeaderModellingTaskPreview :member="item" />
          </v-window-item>
        </v-window>
      </template>
    </v-container>
  </v-container>
</template>
<script lang="ts" setup>
const tab = ref();

const groupStore = useGroup();
const memberModelGroup = computed(() =>
  groupStore.modelGroup?.members
    .filter((item: any) => item.role == "MEMBER")
    .map((item: any) => ({
      id: item.id,
      ...item.user,
    }))
);
</script>
