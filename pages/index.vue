<template>
  <div class="min-h-screen">
    <!-- <DashboardEmployee v-if="employee_user.includes(authStore.user.email)" /> -->
    <!-- <DashboardPj v-if="pj_user.includes(authStore.user.email)" /> -->
    <DashboardSuperadmin />
  </div>
  {{ authenticationStore.user }}
  <v-btn @click="authenticationStore.logout">logout</v-btn>
  <v-btn @click="testGet">login</v-btn>
</template>

<script setup>
import surveyApi from "~/app/api/survey.api";
// import usersConstant from "~/app/constant/users.constant";
const authenticationStore = useAuthenticationStore();
const testGet = async () => {
  await surveyApi.lot_survey_monitorings();
};
// const pj_user = usersConstant.pj_user;
// const employee_user = usersConstant.employee_user;
// const superadmin_user = usersConstant.superadmin_user;
// const authStore = useAuthStore();
// const petaGarisStore = usePetaGarisStore();
// if (
//   superadmin_user.includes(authStore.user.email) ||
//   pj_user.includes(authStore.user.email)
// ) {
//   if (petaGarisStore.totalArray.length == 0) {
//     petaGarisStore.queryAll();
//   }
// }
</script>
