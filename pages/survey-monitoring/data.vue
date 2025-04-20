<template>
  <v-container>
    <!-- <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      @update:options="loadItems"
    ></v-data-table-server> -->
    <AppInputText v-model="search" />
    <v-btn @click="deleteItem"></v-btn>
    <v-data-table
      v-model="selectedId"
      :items="filteredData"
      :headers="fidHeaders"
      show-select
    >
      <template #item.action="{ item }">
        <div class="flex gap-1 text-none">
          <v-btn
            @click="openEditDialog(item)"
            color="tertiary"
            class="text-none"
            >Edit</v-btn
          >
        </div>
      </template>
    </v-data-table>
  </v-container>

  <AppDialog v-model="EditDialog">
    {{ selectedItem }}
    <AppInputText v-model="selectedItem.fid" />
    <v-btn @click="submitEdit"></v-btn>
  </AppDialog>
</template>
<script setup>
import surveyApi from "~/app/api/survey.api";
const surveyStore = useSurveyDataStore();
const fidHeaders = [
  {
    title: "fid",
    value: "fid",
  },
  {
    title: "id",
    value: "id",
  },

  {
    title: "id",
    value: "imageUrls",
  },
  {
    title: "action",
    value: "action",
  },
];
surveyStore.getDataPersil(data_persil_bontang_baru);
const search = ref("");
const filteredData = computed(() => {
  if (search.value) {
    return surveyStore.data_persil_bontang_baru.filter((item) =>
      item.fid.toString().includes(search.value.toString())
    );
  } else {
    return surveyStore.data_persil_bontang_baru;
  }
});
const selectedId = ref([]);
const deleteItem = async () => {
  for (const id of selectedId.value) {
    await surveyApi.delete_lot_survey_monitorings(id.id);
  }
};
const EditDialog = ref(false);
const selectedItem = ref();
const openEditDialog = (item) => {
  EditDialog.value = true;
  selectedItem.value = item;
  console.log(item);
};
const submitEdit = async () => {
  console.log(selectedItem.value);
  await surveyApi.put_lot_survey_monitorings(
    selectedItem.value,
    selectedItem.value.id
  );
};
const itemsPerPage = ref(10);
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
