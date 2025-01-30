<template>
  <v-card variant="flat" class="shadow-lg">
    <v-card-title>Progress Peta Garis</v-card-title>
    <v-card-subtitle> </v-card-subtitle>
    <v-card-text>
      <div class="flex justify-center">
        <v-progress-circular
          :model-value="20 / 514"
          :size="200"
          :width="30"
          color="success"
          class="mb-1"
        >
          <p class="text-2xl font-semibold text-text"></p>
        </v-progress-circular>
      </div>
      <div class="flex gap-1 items-center">
        <v-sheet :height="15" :width="15" color="success"></v-sheet>
        <p>Done</p>
      </div>
      <div class="flex gap-1 items-center">
        <v-sheet :height="15" :width="15" color="grey"></v-sheet>
        <p>On Progress</p>
      </div>
    </v-card-text>
  </v-card>
</template>
