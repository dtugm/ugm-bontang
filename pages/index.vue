<template>
  <div class="min-h-screen">
    <!-- <Superadmin v-if="userInGroup(authStore.user.groups, 'SuperAdmin')" /> -->
    <DashboardStakeHolder
      v-if="
        userInGroup(authStore.user.groups, 'stakeholder') &&
        !userInGroup(authStore.user.groups, 'SuperAdmin')
      "
    />
    <DashboardStudio
      v-if="userInGroup(authStore.user.groups, 'Supervisor Bontang')"
    />
    <DashboardStudio v-if="userInGroup(authStore.user.groups, 'SuperAdmin')" />
    <NewDashboard />
  </div>
</template>

<script setup lang="ts">
import { userInGroup } from "~/app/helper/auth.helper";
const authStore = useAuthenticationStore();
</script>
