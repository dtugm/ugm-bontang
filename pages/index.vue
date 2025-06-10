<template>
  <div class="min-h-screen">
    <!-- {{ userInGroup(authStore.user.groups, "stakeholder") }}
    {{ authStore.user.groups }} -->
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
