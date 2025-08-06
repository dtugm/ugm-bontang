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
        <v-icon color="tertiary">mdi-pencil</v-icon>
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

  <AppDialogConfirm
    title="Add New Vectors"
    close-text="Cancel"
    confirm-text="Add"
    confirm-color="tertiary"
    :confirm-loading="uploadLoading"
    v-model="addDialog"
    @confirm="upload3dTiles"
    @close="addDialog = false"
  >
    <AppInputText label="Name" v-model="uploadForm.name" />
    <AppInputAutocomplete
      label="Category"
      :items="['land_parcel', 'building', 'digitization']"
      v-model="uploadForm.category"
    />
    <AppInputAutocomplete
      label="Type"
      :items="['geojson', 'shp']"
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

  <AppDialogConfirm
    :confirm-loading="uploadLoading"
    v-model="deleteDialog"
    @close="deleteDialog = false"
    @confirm="confirmDeleteVector"
  >
  </AppDialogConfirm>

  <AppDialogConfirm
    title="Edit Vectors"
    close-text="Cancel"
    confirm-text="Update"
    confirm-color="tertiary"
    :confirm-loading="uploadLoading"
    v-model="addDialog"
    @confirm="upload3dTiles"
    @close="addDialog = false"
  >
    <AppInputText label="Name" v-model="uploadForm.name" />
    <AppInputAutocomplete
      label="Category"
      :items="['land_parcel', 'building', 'digitization']"
      v-model="uploadForm.category"
    />
    <AppInputAutocomplete
      label="Type"
      :items="['geojson', 'shp']"
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
</template>
<script setup lang="ts">
const vectorsStore = useVectorsStore();
const landParcelStore = useLandVectors();
// landParcelStore.getLandParcel({});
const uploadForm = ref<IUploadVectorsPayload>({
  name: null,
  // lod: 0,
  category: null,
  status: true,
  type: null,
  file: undefined,
});
const addDialog = ref(false);
const uploadLoading = ref(false);
const upload3dTiles = async () => {
  uploadLoading.value = true;
  await landParcelStore.uploadVectors({
    ...uploadForm.value,
  });
  await landParcelStore.getLandParcel({});
  addDialog.value = false;
  uploadLoading.value = false;
};
const updateStatusVector = async (item: IVectorsItems) => {
  await landParcelStore.updateVectorsStatus(item.id, {
    ...item,
  });
};
const deleteDialog = ref(false);
const selectedId = ref();
const deleteVector = async (item: any) => {
  deleteDialog.value = true;
  selectedId.value = item.id;
};

const confirmDeleteVector = async () => {
  uploadLoading.value = true;
  await vectorsStore.deleteVectore(selectedId.value);
  await vectorsStore.readVectors.getData({ itemsPerPage: 10, page: 1 });
  uploadLoading.value = false;
  deleteDialog.value = false;
};
</script>
