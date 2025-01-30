<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" sm="7">
        <v-card title="Peta Garis" variant="flat" color="secondary">
          <v-card-text>
            <div class="d-flex flex-no-wrap justify-space-between items-center">
              <AppTextH5 color="white">123</AppTextH5>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="5">
        <v-card title="To Do Review" variant="flat" color="secondary">
          <v-card-text>
            <div class="d-flex flex-no-wrap justify-space-between items-center">
              <AppTextH5 color="white">123</AppTextH5>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="9">
        <v-row>
          <v-col cols="12" sm="3">
            <v-card title="Active Personil"></v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card title="Active Personil"></v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card title="Active Personil"></v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card title="Active Personil"></v-card>
          </v-col>

          <v-col cols="12" sm="4">
            <AppCardProgressCircular />
          </v-col>
          <v-col cols="12" sm="4">
            <AppCardProgressCircular />
          </v-col>
          <v-col cols="12" sm="4">
            <AppCardProgressCircular />
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
const authStore = useAuthStore();
const appStore = useAppStore();
const petaGarisStore = usePetaGarisStore();
</script>
