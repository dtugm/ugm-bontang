<template>
  <div class="min-h-screen">
    <!-- Leader Lidar -->
    <DashboardMemberLidarView v-if="isMemberLidar" />
    <DashboardLeaderLidarView v-if="isLeaderLidar" />
  </div>
</template>
<script setup>
const authenticationStore = useAuthenticationStore();
const isMemberLidar = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "Divisi Lidar" && group.role === "MEMBER"
  )
);
const isLeaderLidar = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "Divisi Lidar" && group.role === "LEADER"
  )
);
</script>
