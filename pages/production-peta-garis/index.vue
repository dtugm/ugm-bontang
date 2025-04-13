<template>
  <div class="h-screen">
    <!-- <ProductionPjPetaGaris v-if="pj_user.includes(authStore.user.email)" /> -->
    <ProductionEmployeePetaGaris
      v-if="member_user.includes(authStore.user.email)"
    />
  </div>
</template>
<script setup>
import usersConstant from "~/app/constant/users.constant";
const pj_user = usersConstant.pj_user;
const member_user = [
  ...usersConstant.member_3d_users,
  ...usersConstant.member_lidar_users,
];
const authStore = useAuthenticationStore();
</script>
