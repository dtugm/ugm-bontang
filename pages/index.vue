<template>
  <div>
    <!-- <Superadmin v-if="userInGroup(authStore.user.groups, 'SuperAdmin')" /> -->
    <!-- <DashboardStakeHolder /> -->
    <DashboardStudio
      v-if="userInGroup(authStore.user.groups, 'Supervisor Bontang')"
    />
    <DashboardStudio v-if="userInGroup(authStore.user.groups, 'SuperAdmin')" />
    <NewDashboard
      v-if="
        (userInGroup(authStore.user.groups, 'stakeholder') &&
          !userInGroup(authStore.user.groups, 'SuperAdmin')) ||
        (userInGroup(authStore.user.groups, 'Pelatihan Bontang 2025') &&
          !userInGroup(authStore.user.groups, 'SuperAdmin'))
      "
    />
  </div>
</template>

<script setup lang="ts">
import { userInGroup } from "~/app/helper/auth.helper";
const authStore = useAuthenticationStore();
</script>
