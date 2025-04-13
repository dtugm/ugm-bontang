<template>
  <div class="min-h-screen">
    <!-- <DashboardEmployee v-if="employee_user.includes(authStore.user.email)" /> -->
    <!-- <DashboardPj v-if="pj_user.includes(authStore.user.email)" /> -->
    <Superadmin
      v-if="
        usersConstant.superadmin_user.includes(authenticationStore.user.email)
      "
    />
    <!-- <DashboardPjLogBook
      v-if="usersConstant.pj_user.includes(authenticationStore.user.email)"
    /> -->
    <DashboardStakeHolder
      v-if="
        usersConstant.stakeHolder_user.includes(authenticationStore.user.email)
      "
    />
  </div>
</template>

<script setup>
import usersConstant from "~/app/constant/users.constant";
const authenticationStore = useAuthenticationStore();

// import surveyApi from "~/app/api/survey.api";
// const testGet = async () => {
//   const formData = new FormData();
//   formData.append(
//     "data",
//     JSON.stringify({
//       fid: "mock-fid",
//       taxObjectAddress: "mock-address",
//       ownerType: "PUBLIC_FACILITY",
//       province: "Bontang",
//       status: "ACCURATE",
//       taxPayerName: "mock-taxPayerName",
//       polygonId: "mock-polygon",
//     })
//   );
//   await surveyApi.post_lot_survey_monitorings(formData);
// };
</script>
