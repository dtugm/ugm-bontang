<template>
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold"
      >Detail Properti</v-card-title
    >
    <v-table>
      <tbody>
        <tr v-for="(value, key) in formattedData" :key="key">
          <td class="text-capitalize font-weight-medium">
            {{ formatKey(key) }}
          </td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Jika ingin ubah format tanggal, luas, dll
const formattedData = computed(() => {
  return {
    ...props.data,
    date: new Date(props.data.date).toLocaleDateString(),
    luas: Number(props.data.luas).toFixed(2) + " m²",
    tinggi: props.data.tinggi.toFixed(2) + " m",
  };
});

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
</script>
