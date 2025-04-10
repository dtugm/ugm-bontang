<template>
  <div class="min-h-screen">
    <!-- <DashboardEmployee v-if="employee_user.includes(authStore.user.email)" /> -->
    <!-- <DashboardPj v-if="pj_user.includes(authStore.user.email)" /> -->
    <!-- <DashboardSuperadmin
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
    /> -->

    <!-- Dashboard Studio Member -->
    <DashboardMemberLidarView v-if="isMemberLidar" />
    <DashboardMemberModellingView v-if="isMemberModelling" />

    <!-- Dashboard Studio Leader -->
    <DashboardLeaderLidarView v-if="isLeaderLidar" />
    <DashboardLeaderModellingView v-if="isLeaderModelling" />
  </div>
</template>

<script setup>
import usersConstant from "~/app/constant/users.constant";
const authenticationStore = useAuthenticationStore();
const isMemberLidar = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "Divisi Lidar" && group.role === "MEMBER"
  )
);
const isMemberModelling = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "3d-Modelling" && group.role === "MEMBER"
  )
);

const isLeaderLidar = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "Divisi Lidar" && group.role === "LEADER"
  )
);
const isLeaderModelling = computed(() =>
  authenticationStore.user.groups.some(
    (group) => group.name === "3d-Modelling" && group.role === "LEADER"
  )
);
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
