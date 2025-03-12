<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card variant="flat" class="h-[calc(100vh-32px)]">
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
              <AppButton
                variant="outlined"
                label="Add"
                color="info"
                @click="addDialog = true"
              />
            </v-row>
            <!-- <v-btn @click="downloadJSON">download</v-btn> -->
            <v-data-table
              :loading="isTableLoading"
              class="h-[calc(100vh-100px)]"
              :headers="headers"
              :items="filteredData"
              items-per-page="20"
              fixed-header
              fixed-footer
            >
              <template #item.action="{ item }">
                <div class="flex gap-2">
                  <v-btn color="primary" @click="openDetailLog(item)"
                    >Detail</v-btn
                  >
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="openDelete(item)"
                    >Delete</v-btn
                  >
                </div>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <AppDialog v-model="addDialog">
    <v-card-text>
      <v-form
        id="logbookForm"
        ref="formRef"
        @submit.prevent="handleSubmitLogbook()"
      >
        <v-row>
          <v-col cols="12">
            <AppInputDatePicker
              v-model="logBookForm.date"
              label="Tanggal"
              :rules="[(value) => !!value || 'This field is required']"
              required
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <AppInputAutocomplete
              v-model="logBookForm.pic"
              label="PIC"
              :items="names"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <AppInputAutocomplete
              multiple
              v-model="logBookForm.team"
              :items="[
                'TIM A',
                'TIM B',
                'TIM C',
                'TIM D',
                'TIM E',
                'TIM F',
                'TIM G',
                'TIM H',
              ]"
              label="Team"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <AppInputAutocomplete
              multiple
              v-model="logBookForm.anggota"
              :items="names"
              label="Anggota"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <AppInputAutocomplete
              v-model="logBookForm.kelurahan"
              :items="['Bontang Baru', 'Api api', 'Loktuan']"
              label="Kelurahan"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <AppInputText
              v-model="logBookForm.kecamatan"
              label="Kecamatan"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <AppInputText v-model="logBookForm.rt" label="RT" hide-details />
          </v-col>
          <v-col cols="6">
            <AppInputText
              v-model="logBookForm.progress"
              label="Capaian"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <AppInputText
              v-model="logBookForm.judul_kegiatan"
              label="Judul Kegiatan"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <AppInputTextarea
              v-model="logBookForm.kegiatan"
              label="Kegiatan"
              hide-details
            />
          </v-col>
        </v-row>
        <v-card-actions>
          <v-checkbox v-model="isDone" title="hshs">
            <template v-slot:label>
              <p class="text-text">
                Saya yakin sudah mengisi
                <span class="text-primary"> Data </span> secara keseluruhan
              </p>
            </template></v-checkbox
          >
          <v-spacer></v-spacer>
          <AppButton
            label="Cancel"
            color="info"
            variant="outlined"
            @click="addDialog = false"
          />
          <AppButton
            :loading="isButtonLoading"
            :disabled="!isDone"
            form="logbookForm"
            label="Submit"
            color="success"
            type="submit"
          />
        </v-card-actions>
      </v-form>
    </v-card-text>
  </AppDialog>
  <AppDialogLogbookSurvey
    v-model="logDetailDialog"
    :selected-log="selectedLog"
  />
  <AppDialog v-model="deleteDialog" title="Hapus Data Logbook?" width="500">
    <v-card-text>
      It can't be undone
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="deleteDialog = false"
        />
        <AppButton
          :loading="deleteLoading"
          form="presensiForm"
          label="Delete"
          color="error"
          @click="deleteDataLogbook"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
</template>
<script setup>
const surveyStore = useSurveyStore();
const addDialog = ref(false);
const logBookForm = ref({ date: "" });
const headers = [
  { title: "PIC", value: "pic" },
  // { title: "Team", value: "team" },
  { title: "Tanggal", value: "date", sortable: true },
  //   { title: "Kelurahan", value: "kelurahan" },
  //   { title: "Kecamatan", value: "kecamatan" },
  //   { title: "RT", value: "rt" },
  { title: "Kegiatan", value: "judul_kegiatan" },
  { title: "Progress", value: "progress" },
  //   { title: "Lokasi", value: "location" },
  // { title: "Catatan", value: "notes" },
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
onMounted(() => {
  fetchAllData();
});
const dateFilter = ref();
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
const filteredData = computed(() => {
  if (dateFilter.value) {
    return surveyStore.logBookData.filter(
      (item) => item.date == dateFilter.value
    );
  } else {
    return surveyStore.logBookData;
  }
});
const openDetailLog = (item) => {
  logDetailDialog.value = true;
  selectedLog.value = item;
};
const selectedItemLog = ref({});
const deleteDialog = ref(false);
const openDelete = (item) => {
  selectedItemLog.value = item;
  deleteDialog.value = true;
};
const deleteDataLogbook = async () => {
  await surveyStore.deleteLogBook(selectedItemLog.value.path);
  deleteDialog.value = false;
  fetchAllData();
};
const downloadJSON = () => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(surveyStore.logBookData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
};
</script>
