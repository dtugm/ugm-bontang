<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" md="4">
        <DashboardPjPresensiCard />
      </v-col>
      <v-col cols="12" md="4">
        <AppCardInformation title="Peta Garis" :target-value="514" />
      </v-col>
      <v-col cols="12" md="4">
        <AppCardInformation title="3d Models" :target-value="3959" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12" md="4">
            <DashboardPjProgressCardPetaGaris />
          </v-col>
          <v-col cols="12" md="4">
            <DashboardPjProgressCard3dModels />
          </v-col>
          <v-col cols="12" md="4">
            <DashboardPjProgressCardSurverPbb />
          </v-col>
          <v-col cols="12" md="12">
            <DashboardPjPresensiTable />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3">
        <DashboardLeaderboard />
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- jdksj -->
