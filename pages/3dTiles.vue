<template>
  <AppTableBasic
    :items="tiles3dStore.tiles3dItems"
    :headers="tiles3dConstant.tiles3dHeaders"
    title="3D Tiles List"
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
    <template #item.action>
      <v-btn icon variant="flat" rounded="sm" density="compact">
        <v-icon color="tertiary">mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon variant="flat" rounded="sm" density="compact">
        <v-icon color="primary">mdi-delete</v-icon>
      </v-btn>
    </template>
  </AppTableBasic>

  <AppDialogConfirm
    title="Add New 3D Tiles"
    close-text="Cancel"
    confirm-text="Add"
    confirm-color="tertiary"
    :confirm-loading="uploadLoading"
    v-model="addDialog"
    @confirm="upload3dTiles"
  >
    <AppInputAutocomplete
      label="Category"
      :items="['road', 'building']"
      v-model="uploadForm.category"
    />
    <AppInputText
      label="Center X (lng)"
      type="number"
      v-model="uploadForm.center_x"
    />
    <AppInputText
      label="Center Y (lat)"
      type="number"
      v-model="uploadForm.center_y"
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
<script lang="ts" setup>
import tiles3dConstant from "~/app/constant/3dTiles.constant";
const tiles3dStore = use3dTilesStore();
tiles3dStore.getAll3dTiles();
const uploadForm = ref<IUpload3dTilesPayload>({
  category: null,
  status: true,
  center_x: 0,
  center_y: 0,
  file: undefined,
});
const addDialog = ref(false);
const uploadLoading = ref(false);
const upload3dTiles = async () => {
  uploadLoading.value = true;
  await tiles3dStore.upload3dTiles(uploadForm.value);
  addDialog.value = false;
  uploadLoading.value = false;
};
</script>
