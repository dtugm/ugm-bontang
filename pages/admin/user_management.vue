<template>
  <AppTableBasic
    :items="userStore.usersList"
    :headers="usersListHeader"
    title="List User"
  />
</template>

<script setup lang="ts">
const userStore = useUsersStore();
userStore.getUsersList();
const usersListHeader = [
  { title: "No", key: "no" },
  { title: "Email", key: "email" },
  { title: "First Name", key: "firstName" },
  { title: "Last Name", key: "lastName" },
  { title: "ID Organisasi", key: "organizationId" },
  { title: "Organisasi Name", key: "organizationName" },
  { title: "Role", key: "role" },
];
</script>
