<template>
  <div class="min-h-screen">
    <DashboardEmployee v-if="employee_user.includes(authStore.user.email)" />
    <DashboardPj v-if="pj_user.includes(authStore.user.email)" />
    <!-- <DashboardSuperadmin v-if="pj_user.includes(authStore.user.email)" /> -->
  </div>
</template>

<script setup>
import usersConstant from "~/app/constant/users.constant";
const pj_user = usersConstant.pj_user;
const employee_user = usersConstant.employee_user;
const authStore = useAuthStore();
</script>
