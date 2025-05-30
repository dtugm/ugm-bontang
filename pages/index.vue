<template>
  <div class="min-h-screen">
    <Superadmin
      v-if="
        usersConstant.superadmin_user.includes(authenticationStore.user.email)
      "
    />
    <DashboardPjLogBook
      v-if="usersConstant.pj_user.includes(authenticationStore.user.email)"
    />
    <DashboardStakeHolder
      v-if="
        usersConstant.stakeHolder_user.includes(authenticationStore.user.email)
      "
    />
  </div>
</template>

<script setup lang="ts">
import usersConstant from "~/app/constant/users.constant";
const authenticationStore = useAuthenticationStore();

const isStakeholder = computed(() => {
  return authenticationStore.user.groups.some(
    (group: any) => group.name.toLowerCase() === "stakeholder"
  );
});
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
