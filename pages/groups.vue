<template>
  <AppTableBasic
    title="Groups Table"
    :items="groupStore.groupsItems"
    :headers="groupListHeaders"
  >
    <template #item.member="{ item }">{{ item.members.length }}</template>
  </AppTableBasic>
</template>
<script lang="ts" setup>
const groupStore = useGroup();
groupStore.getAllGroups();

const groupListHeaders = [
  { title: "No", key: "no" },
  { title: "Group Name", key: "name" },
  { title: "Description", key: "description" },
  { title: "Member", key: "member" },
  { title: "Actions", key: "action" },
];
</script>
