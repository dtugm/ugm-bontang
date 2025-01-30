<template>
  <v-card>
    <v-container fluid>
      <v-row no-gutters class="items-center gap-4">
        <slot name="prepend"></slot>
        <AppTextH5 color="primary"> Update persil Survey</AppTextH5>
        <v-btn
          class="text-none mx-2"
          variant="outlined"
          color="green"
          :disabled="updateId.length == 0"
          @click="updateDialog = true"
          >Update</v-btn
        >
        <v-spacer></v-spacer>
        <v-col lg="3">
          <v-text-field
            v-model="search"
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
        :search="search"
        :items="persilMock.persil_table_mock"
        :headers="persilConstant.header"
      >
        <template #item.status="{ item }">
          <v-chip :color="isPersilDone(item.persil_id) ? 'success' : 'error'">
            {{ isPersilDone(item.persil_id) ? "DONE" : "Not Done" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-container>
  </v-card>
  <AppDialog v-model="updateDialog" title="Update Persil" width="500">
    <v-card-text>
      Pastikan data yang akan diupdate sudah benar
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="updateDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Update"
          color="success"
          @click="updatePersil"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
</template>
<script setup>
import persilMock from "~/app/mock/persil.mock";
import persilConstant from "~/app/constant/persil.constant";
import { getFirestore, writeBatch, doc, collection } from "firebase/firestore";
const db = getFirestore();
const bulkUpdate = async (collectionName, updates) => {
  const batch = writeBatch(db);
  updates.forEach((item) => {
    const docRef = doc(db, collectionName, item.D_NOP);
    batch.set(docRef, item);
  });

  try {
    await batch.commit();
    appStore.toastSuccess("Batch update berhasil!");
  } catch (error) {
    appStore.toastError("Error saat batch update:", error);
  }
};
const appStore = useAppStore();
const updateId = ref([]);
const search = ref("");
const updateDialog = ref(false);
const updatePersil = async () => {
  const payload = updateId.value.map((item) => {
    return { D_NOP: item, status: true };
  });
  await bulkUpdate("surveyProgress", payload);
  updateId.value = [];
  updateDialog.value = false;
};
const surveyProgress = useCollection(collection(db, "surveyProgress"));
const isPersilDone = (id) => {
  return surveyProgress.value.some(
    (item) => item.D_NOP === id && item.status === true
  );
};
</script>
