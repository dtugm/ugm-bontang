<template>
  View Leader Lidar {{ formTask }}

  <!-- {{ groupStore.lidarGroup?.members }} -->
  {{ memberLidarItem }}
  <v-container>
    <AppInputAutocomplete
      v-model="formTask.userId"
      :items="memberLidarItem"
      item-title="email"
      item-value="id"
      label="Member"
    ></AppInputAutocomplete>
    <AppInputText
      v-model="formTask.grid"
      label="Grid"
      type="number"
    ></AppInputText>
    <v-btn @click="createMockTask">Create Task</v-btn>
  </v-container>
</template>
<script lang="ts" setup>
import { useGroup } from "#imports";
import studioLidarApi from "~/app/api/studioLidar.api";
const formTask: any = ref({});
const createMockTask = async () => {
  const payload = {
    groupId: "7d8533c5-5d84-45e8-8812-77aa6cead296",
    assignedToUserId: formTask.value.userId,
    status: "TODO",
    taskName: `GRID ${formTask.value.grid} `,
    notes: "",
    serverPath: "",
  };
  console.log(payload);
  await studioLidarApi.create_lidar_task(payload);
};
const groupStore = useGroup();
const memberLidarItem = computed(() =>
  groupStore.lidarGroup?.members
    .filter((item: any) => item.role == "MEMBER")
    .map((item: any) => ({
      id: item.id,
      email: item.user.email,
    }))
);
</script>
