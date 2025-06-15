<template>
  <AppTableData :read-data="landParcelStore.readVectorsLandParcel">
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
    <template #item.action="{ item }">
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
    <!-- <AppInputText label="LOD" type="number" v-model="uploadForm.lod" /> -->
    <AppInputAutocomplete
      label="Category"
      :items="['land_parcel', 'building']"
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
</script>
