<template>
  <AppTableData
    :is-searchable="false"
    title="Vectors 2D"
    :read-data="vectorsStore.readVectors"
  >
    <template #action>
      <v-btn
        variant="outlined"
        color="success"
        class="text-none"
        prepend-icon="mdi-plus"
        @click="addDialog = true"
        >Add
      </v-btn>
    </template>
    <template #item.isActive="{ item }">
      <v-chip
        density="comfortable"
        :color="item.isActive ? 'success' : 'error'"
        >{{ item.isActive ? "Active" : "Non Active" }}</v-chip
      >
    </template>
    <template #item.action="{ item }">
      <v-btn icon variant="flat" rounded="sm" density="compact">
        <v-icon color="tertiary" @click="editVectors(item)">mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon variant="flat" rounded="sm" density="compact">
        <v-icon color="primary" @click="deleteVector(item)">mdi-delete</v-icon>
      </v-btn>
    </template>
    <template #item.status_action="{ item }">
      <div class="flex items-center">
        <v-switch
          color="success"
          inset
          hide-details
          v-model="item.isActive"
          @update:model-value="updateStatusVector(item)"
        ></v-switch>
      </div>
    </template>
  </AppTableData>

  <!-- Add File -->
  <AppDialogConfirm
    title="Add New Vectors"
    close-text="Cancel"
    confirm-text="Add"
    confirm-color="tertiary"
    :confirm-loading="vectorsStore.isUploading"
    v-model="addDialog"
    @confirm="uploadVector"
    @close="addDialog = false"
  >
    <AppInputText label="Name" v-model="uploadForm.name" />
    <AppInputAutocomplete
      label="Category"
      :items="vectorsConstant.CategoryType"
      v-model="uploadForm.category"
    />
    <AppInputAutocomplete
      label="File Type"
      :items="vectorsConstant.FileType"
      v-model="uploadForm.type"
    />
    <v-switch
      color="success"
      inset
      label="Status"
      v-model="uploadForm.status"
    />
    <AppInputFileIBoxV2 v-model="uploadForm.file" />
  </AppDialogConfirm>

  <!-- Delete File -->
  <AppDialogConfirm
    :confirm-loading="vectorsStore.isDeletingFile"
    v-model="deleteDialog"
    @close="deleteDialog = false"
    @confirm="confirmDeleteVector"
  />

  <!-- Edit File -->
  <AppDialogConfirm
    title="Edit Vectors"
    close-text="Cancel"
    confirm-text="Edit"
    confirm-color="tertiary"
    :confirm-loading="vectorsStore.isUploading"
    v-model="editDialog"
    @confirm="confirmEditVector"
    @close="editDialog = false"
  >
    <AppInputText label="Name" v-model="editForm.name" />
    <AppInputAutocomplete
      label="Category"
      :items="vectorsConstant.CategoryType"
      v-model="editForm.category"
    />
    <AppInputAutocomplete
      label="File Type"
      :items="vectorsConstant.FileType"
      v-model="editForm.type"
    />
    <v-switch color="success" inset label="Status" v-model="editForm.status" />
    <AppInputFileIBoxV2 v-model="editForm.file" />
  </AppDialogConfirm>
</template>
<script setup lang="ts">
import vectorsConstant from "~/app/constant/management/vectorsManagement.constant";
const vectorsStore = useVectorsStore();
const uploadForm = ref<IUploadVectorsPayload>(
  vectorsConstant.defaultUploadForm
);
// ADD METHOD
const addDialog = ref(false);
const uploadVector = async () => {
  await vectorsStore.addNewVector({
    ...uploadForm.value,
  });
  await vectorsStore.readVectors.getData({ itemsPerPage: 10, page: 1 });
  addDialog.value = false;
};

const updateStatusVector = async (item: IVectorsItems) => {
  await vectorsStore.updateVectorsStatus(item.id, {
    ...item,
  });
};

// DELETE METHOD
const deleteDialog = ref(false);
const selectedId = ref();
const deleteVector = async (item: any) => {
  deleteDialog.value = true;
  selectedId.value = item.id;
};
const confirmDeleteVector = async () => {
  await vectorsStore.deleteVectore(selectedId.value);
  await vectorsStore.readVectors.getData({ itemsPerPage: 10, page: 1 });
  deleteDialog.value = false;
};

const editDialog = ref(false);
const editForm: any = ref({});
const editVectors = async (item: any) => {
  editDialog.value = true;
  editForm.value = JSON.parse(JSON.stringify(item));
  selectedId.value = item.id;
};

const confirmEditVector = async () => {
  await vectorsStore.updateVectorsStatus(selectedId.value, editForm.value);
  await vectorsStore.readVectors.getData({ itemsPerPage: 10, page: 1 });
  editDialog.value = false;
};
</script>
