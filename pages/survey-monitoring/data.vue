<template>
  <v-container>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      @update:options="loadItems"
    ></v-data-table-server>
  </v-container>
</template>
<script setup>
import surveyApi from "~/app/api/survey.api";
const itemsPerPage = ref(10);
const search = ref("");
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);
async function loadItems({ page, itemsPerPage, sortBy }) {
  loading.value = true;
  await surveyApi
    .lot_survey_monitorings({ page: page, pageSize: itemsPerPage })
    .then(({ data, totalDocuments }) => {
      serverItems.value = data;
      totalItems.value = totalDocuments;
      loading.value = false;
    });
}
</script>
