<template>
  <v-card variant="flat" class="h-[calc(100vh-200px)]">
    <v-container>
      <v-row no-gutters class="items-center gap-4">
        <slot name="prepend"></slot>
        <AppTextH5 color="primary">LogBook Survey PBB</AppTextH5>
        <v-spacer></v-spacer>
        <AppInputDatePicker
          placeholder="Filter By Date"
          is-filter
          clearable
          v-model="dateFilter"
          v-on:clear="dateFilter = null"
        />
      </v-row>
      <v-data-table
        :loading="isTableLoading"
        class="h-[calc(100vh-250px)]"
        :headers="headers"
        :items="filteredData"
        :sort-by="[{ key: 'date', order: 'desc' }]"
        fixed-header
        fixed-footer
      >
        <template #item.action="{ item }">
          <v-btn
            class="text-none"
            color="primary"
            variant="outlined"
            @click="openDetailLog(item)"
            >Detail</v-btn
          >
        </template>
      </v-data-table>
    </v-container>
  </v-card>

  <AppDialogLogbookSurvey
    v-model="logDetailDialog"
    :selected-log="selectedLog"
  />
</template>
<script setup>
const dateFilter = ref();
const surveyStore = useSurveyStore();
const addDialog = ref(false);
const logBookForm = ref({ date: "" });
const headers = [
  { title: "PIC", value: "pic", minWidth: "200px", maxWidth: "200px" },
  { title: "Tanggal", value: "date", sortable: true, minWidth: "150px" },
  {
    title: "Kegiatan",
    value: "judul_kegiatan",
    maxWidth: "200px",
    minWidth: "200px",
  },
  { title: "Progress", value: "progress", minWidth: "70px", maxWidth: "70px" },
  { title: "Action", value: "action" },
];
const names = [
  "Hyatma Adikara Ajrin",
  "Fikri Kurniawan",
  "Elizabeth Angela Prasetyarini",
  "Kinanthi Puteri Nastiti",
  "Cintia Lirifa Asmarani",
  "Wegyzaldy",
  "Praba Sultan Arian Alhamdy Syukron",
  "Lutfy Angsoka Novita",
];
const isDone = ref(false);
const formRef = ref();
const isTableLoading = ref(false);
const fetchAllData = async () => {
  isTableLoading.value = true;
  await surveyStore.getAllLogBook();
  isTableLoading.value = false;
};
const filteredData = computed(() => {
  if (dateFilter.value) {
    return surveyStore.logBookData.filter(
      (item) => item.date == dateFilter.value
    );
  } else {
    return surveyStore.logBookData;
  }
});
onMounted(() => {
  fetchAllData();
});
const isButtonLoading = ref(false);
const handleSubmitLogbook = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    const payload = {
      ...logBookForm.value,
    };
    isButtonLoading.value = true;
    await surveyStore.addLogBook(
      "LogBookSurvey",
      payload,
      "log_book_bontang_baru",
      "bontang_baru"
    );
    isButtonLoading.value = false;
    addDialog.value = false;
    logBookForm.value = { date: "" };
    fetchAllData();
  }
};
const selectedLog = ref({});
const logDetailDialog = ref(false);
const openDetailLog = (item) => {
  logDetailDialog.value = true;
  selectedLog.value = item;
};
</script>
