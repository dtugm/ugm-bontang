<template>
  <v-container fluid class="h-full">
    <v-row>
      <v-col cols="12" sm="4"> </v-col>
      <!-- <v-col cols="12" sm="4" align-self="end">
        <AppCardProgress
          title="Peta Garis"
          :total-value="514"
          unit="GRID"
          :progress="petaGarisStore.totalGrid"
        />
      </v-col> -->
    </v-row>
    <!-- <v-row class="">
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
    </v-row> -->
  </v-container>
</template>
<script lang="ts" setup>
const authStore = useAuthStore();
const appStore = useAppStore();
const petaGarisStore = usePetaGarisStore();
</script>
