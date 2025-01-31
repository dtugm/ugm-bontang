<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" sm="4">
        <DashboardPjPresensiCard />
      </v-col>
      <v-col cols="12" sm="4">
        <AppCardInformation />
      </v-col>
      <v-col cols="12" sm="4">
        <AppCardInformation />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="9">
        <v-row>
          <v-col cols="12" sm="4">
            <DashboardPjProgressCardPetaGaris />
          </v-col>
          <v-col cols="12" sm="4">
            <DashboardPjProgressCard3dModels />
          </v-col>
          <v-col cols="12" sm="4">
            <DashboardPjProgressCardSurverPbb />
          </v-col>
          <v-col cols="12" sm="12">
            <v-card variant="flat" class="h-[calc(100vh-124px-347.88px-53px)]">
              <v-container>
                <v-data-table
                  class="h-[calc(100vh-124px-347.88px-73px)]"
                  :headers="header"
                  :items="mockDataStatus"
                  fixed-header
                  fixed-footer
                >
                </v-data-table>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="3">
        <DashboardLeaderboard />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import pjConstant from "~/app/constant/pj.constant";
const header: any = pjConstant.employeeStatusHeader;
const mockDataStatus = [
  { nama: "Test", email: "email" },
  { nama: "Test", email: "email" },
  { nama: "Test", email: "email" },
  { nama: "Test", email: "email" },
  { nama: "Test", email: "email" },
  { nama: "Test", email: "email" },
  { nama: "Test", email: "email" },
];
const authStore = useAuthStore();
const appStore = useAppStore();
const petaGarisStore = usePetaGarisStore();
</script>
