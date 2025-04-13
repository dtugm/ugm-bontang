<template>
  <!-- Member Lidar -->
  <DashboardMemberModellingView v-if="isMemberModelling" />
  <DashboardLeaderModellingView v-if="isLeaderModelling" />
</template>
<script setup>
const authenticationStore = useAuthenticationStore();
const isMemberModelling = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "3d-Modelling" && group.role === "MEMBER"
  )
);

const isLeaderModelling = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "3d-Modelling" && group.role === "LEADER"
  )
);
</script>
