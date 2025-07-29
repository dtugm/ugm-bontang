<template>
  <div class="min-h-screen">
    <Superadmin
      v-if="usersConstant.superadmin_user.includes(authStore.user.email)"
    />
    <DashboardStakeHolder
      v-if="usersConstant.stakeHolder_user.includes(authStore.user.email)"
    />
    <DashboardStudio
      v-if="userInGroup(authStore.user.groups, 'Supervisor Bontang')"
    />
  </div>
</template>

<script setup lang="ts">
import { userInGroup } from "~/app/helper/auth.helper";
import usersConstant from "~/app/constant/users.constant";
const authStore = useAuthenticationStore();

const isStakeholder = computed(() => {
  return authStore.user.groups.some(
    (group: any) => group.name.toLowerCase() === "stakeholder"
  );
});
</script>
