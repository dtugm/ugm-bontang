<template>
  <div class="glass-div">
    <v-card-text class="pa-0 flex flex-col gap-2">
      <div v-for="item in legendItems" :key="item.label" class="flex">
        <div
          :style="{ backgroundColor: item.color }"
          class="w-4 h-4 mr-2 rounded-sm border"
        ></div>
        <span class="text-xs">{{ item.label }}</span>
      </div>
    </v-card-text>
  </div>
</template>
<script lang="ts" setup>
const legendItems = [
  { label: "Solar Cost Saving Prime", color: "#2E7D32" }, // hijau
  { label: "Solar Cost Saving Suitable", color: "#66BB6A" }, // hijau muda
  { label: "Solar Cost Saving Marginal", color: "#FFD54F" }, // kuning
  { label: "Solar Cost Saving Not Recommended", color: "#E53935" }, // merah
];
</script>
<style scoped>
.glass-div {
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.3); /* putih transparan */
  padding: 10px;
  border-radius: 12px; /* lebih membulat biar efek kaca enak */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* shadow halus */
  backdrop-filter: blur(10px); /* efek kaca */
  -webkit-backdrop-filter: blur(10px); /* untuk Safari */
  border: 1px solid rgba(255, 255, 255, 0.2); /* garis tipis biar kayak kaca */
}
</style>
