<template>
  <v-container class="h-full">
    <v-row align="stretch" class="">
      <v-col cols="12" sm="4">
        <v-card class="h-full">
          <template v-slot:append>
            <v-chip>Checked In</v-chip>
          </template>
          <template #title>
            Hello,
            <span class="text-primary font-bold">
              {{
                authStore.user?.displayName
                  ? authStore.user?.displayName
                  : authStore.user?.email
              }}
            </span>
          </template>
          <template #subtitle>
            <p>Hari ini, {{ appStore.currentDate }}</p>
          </template>
          <template #text>
            <div class="flex gap-2">
              <AppButton
                color="success"
                append-icon="mdi-login"
                label="Check In"
              />
              <AppButton
                variant="outlined"
                color="error"
                append-icon="mdi-logout"
                label="Check Out"
              />
            </div>
            <p class="text-text text-md mt-1">Office Hour (08.30 - 17.00)</p>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" align-self="end">
        <AppCardProgress
          title="Peta Garis"
          :total-value="514"
          unit="GRID"
          :progress="petaGarisStore.totalGrid"
        />
      </v-col>
      <v-col cols="12" sm="4" align-self="end">
        <!-- <AppCardProgress title="3D Model" :total-value="128" :progress="2" /> -->
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" sm="9" class="h-full">
        <v-card class="h-full">
          <v-container>
            <DashboardPjTabs />
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3" class="h-full">
        <v-card class="h-full">
          <DashboardPjPresensiEmployee />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
const authStore = useAuthStore();
const appStore = useAppStore();
const petaGarisStore = usePetaGarisStore();
</script>
