<template>Lidar View</template>
<script lang="ts" setup>
import studioLidarApi from "~/app/api/studioLidar.api";
const authenticationStore = useAuthenticationStore();
const memberLidarId = computed(() => {
  const found = authenticationStore.user.groups.find(
    (group: any) => group.name === "Divisi Lidar" && group.role === "MEMBER"
  );
  return found?.id || null;
});
await studioLidarApi.get_all_lidar_tasks(memberLidarId.value);
</script>
