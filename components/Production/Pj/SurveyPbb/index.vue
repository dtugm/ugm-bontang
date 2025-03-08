<template>
  <v-container fluid class="h-full">
    <v-card class="h-full" variant="flat">
      <v-container fluid class="h-full">
        <v-tabs
          v-model="tab"
          color="tertiary"
          density="compact"
          selected-class="font-weight-bold"
        >
          <v-tab
            v-for="(item, index) in kelurahan"
            :key="index"
            :value="item.value"
            class="text-none"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="bontang_baru">
            <ProductionPjSurveyPbbBontangBaru />
          </v-window-item>
          <v-window-item value="api_api"> api api</v-window-item>
          <v-window-item value="loktuan">loktuan</v-window-item>
        </v-window>
      </v-container>
    </v-card>
  </v-container>
</template>
<script setup>
const tab = ref();
const kelurahan = [
  { title: "Bontang Baru", value: "bontang_baru" },
  { title: "Api Api", value: "api_api" },
  { title: "Loktuan", value: "loktuan" },
];
</script>
