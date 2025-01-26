<template>
  <v-card class="h-full">
    <template #text>
      <v-row justify="end">
        <v-col class="text-lg">
          Total
          <span class="text-primary font-bold"> Peta Garis </span>
          <div class="flex items-end gap-1">
            <AppTextH2>528</AppTextH2>
            <p>Grid</p>
          </div>
        </v-col>
        <v-col class="flex justify-end">
          <v-progress-circular
            color="warning"
            model-value="20"
            :size="80"
            :width="8"
          >
            30/528
          </v-progress-circular>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>
