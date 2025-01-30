<template>
  <div class="h-screen">
    <ProductionPetaGaris v-if="pj_user.includes(authStore.user.email)" />
  </div>
</template>
<script setup>
import usersConstant from "~/app/constant/users.constant";
const pj_user = usersConstant.pj_user;
const employee_user = usersConstant.employee_user;
const authStore = useAuthStore();
</script>
