<template>
  <v-card
    class="px-2"
    width="250"
    style="background-color: rgba(255, 255, 255, 0.85)"
  >
    <!-- <v-card-title class="text-sm font-bold pa-1">Legend</v-card-title> -->
    <v-divider class="my-1"></v-divider>

    <!-- Dropdown selector -->
    <v-select
      v-model="selectedLegend"
      :items="legendOptions"
      label="Select Legend"
      density="compact"
      dense
      outlined
      hide-details
      class="mb-2"
    ></v-select>

    <!-- Tampilan legend -->
    <v-card-text class="pa-0" style="max-height: 50vh; overflow-y: auto">
      <div
        v-for="(color, key) in legendData[selectedLegend].colors"
        :key="key"
        class="flex items-center mb-1"
      >
        <div
          :style="{ backgroundColor: color }"
          class="w-4 h-4 mr-2 rounded-sm border"
        ></div>
        <span class="text-xs">{{
          legendData[selectedLegend].labels[key] || key
        }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

// Data legend
const legendData = {
  JENIS_TNH: {
    colors: {
      1: "#4CAF50",
      2: "#2196F3",
      3: "#FFC107",
      4: "#9C27B0",
      5: "#F44336",
    },
    labels: {
      1: "Tanah & Bangunan",
      2: "Kavling Siap Bangun",
      3: "Tanah Kosong",
      4: "Fasilitas Umum",
      5: "Tanah Pemerintah",
    },
  },
  JENIS_BGN: {
    colors: {
      1: "#4caf50",
      2: "#2196f3",
      3: "#f44336",
      4: "#ff9800",
      5: "#9c27b0",
      6: "#00bcd4",
      7: "#ffeb3b",
      8: "#795548",
      9: "#3f51b5",
      10: "#8bc34a",
      11: "#9e9e9e",
    },
    labels: {
      1: "Perumahan",
      2: "Perkantoran Swasta",
      3: "Pabrik",
      4: "Toko/Apotek/Pasar/Ruko",
      5: "Rumah Sakit/Klinik",
      6: "Olahraga/Rekreasi",
      7: "Hotel/Wisma",
      8: "Bengkel/Gudang/Pertanian",
      9: "Gedung Pemerintah",
      10: "Gedung Sekolah",
      11: "Lain-lain",
    },
  },
  Kodefikasi_BOBA: {
    colors: {
      1: "#008000",
      2: "#FFD700",
      3: "#FFA500",
      4: "#FF8C00",
      5: "#FF4500",
      6: "#B22222",
      7: "#FF8C00",
      8: "#FF4500",
      9: "#008000",
    },
    labels: {
      1: "ACCURATE",
      2: "NEW DATA",
      3: "TAX OBJECT MERGE",
      4: "TAX OBJECT SPLIT",
      5: "DELINEATION",
      6: "CONFLICT",
      7: "OWNER CANNOT BE MEET",
      8: "NOT YET SURVEYED",
      9: "OTHER",
    },
  },
};

// List legend yang bisa dipilih
const legendOptions = Object.keys(legendData);
const selectedLegend = ref(legendOptions[0]); // Default legend pertama
</script>

<style scoped>
.w-4 {
  width: 16px;
}
.h-4 {
  height: 16px;
}
</style>
