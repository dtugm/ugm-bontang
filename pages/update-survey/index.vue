<template>
  <v-container>
    <v-row no-gutters class="items-center gap-4">
      <slot name="prepend"></slot>
      <AppTextH5 color="primary"> Update persil Survey</AppTextH5>
      <v-btn class="text-none mx-2" variant="outlined" color="green"
        >Update</v-btn
      >
      <v-spacer></v-spacer>
      <v-col lg="3">
        <v-text-field
          append-inner-icon="mdi-magnify"
          placeholder="Search..."
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-data-table
      v-model="updateId"
      show-select
      item-value="persil_id"
      :items="items"
      :headers="header"
    >
      <template #item.status="{ item }">
        <v-chip :color="item.status ? 'success' : 'error'">
          {{ item.status ? "DONE" : "Not Done" }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>
<script setup>
const updateId = ref([]);
const items = [
  {
    persil_id: 1,
    kecamatan: "Kecamatan 1",
    kelurahan: "Kelurahan 1",
    desa: "Desa 1",
    status: false,
  },

  {
    persil_id: 2,
    kecamatan: "Kecamatan 2",
    kelurahan: "Kelurahan 2",
    desa: "Desa 2",
    status: false,
  },
  {
    persil_id: 3,
    kecamatan: "Kecamatan 3",
    kelurahan: "Kelurahan 3",
    desa: "Desa 3",
    status: false,
  },
  {
    persil_id: 4,
    kecamatan: "Kecamatan 4",
    kelurahan: "Kelurahan 4",
    desa: "Desa 4",
    status: false,
  },
  {
    persil_id: 5,
    kecamatan: "Kecamatan 5",
    kelurahan: "Kelurahan 5",
    desa: "Desa 5",
    status: false,
  },
  {
    persil_id: 6,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 7,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 8,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 9,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 10,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 11,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 12,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
  {
    persil_id: 13,
    kecamatan: "Kecamatan 6",
    kelurahan: "Kelurahan 6",
    desa: "Desa 6",
    status: true,
  },
];
const header = [
  { title: "Persil ID", value: "persil_id" },
  { title: "Nama Kecamatan", value: "kecamatan" },
  { title: "Nama Kelurahan", value: "kelurahan" },
  { title: "Nama Desa", value: "desa" },
  { title: "Status", value: "status", sortable: true },
];
</script>
