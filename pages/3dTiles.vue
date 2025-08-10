<template>
  <AppTableBasic
    :loading="tiles3dStore.isFetchingData"
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
    <template #item.action="{ item }">
      <!-- <v-btn icon variant="flat" rounded="sm" density="compact">
        <v-icon color="tertiary">mdi-pencil</v-icon>
      </v-btn> -->
      <v-switch
        color="success"
        inset
        label="Status"
        v-model="uploadForm.status"
        @update:model-value="updateStatus(item)"
      />
      <v-btn
        icon
        variant="flat"
        rounded="sm"
        density="compact"
        @click="delete3dTiles(item)"
      >
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
    @close="addDialog = false"
  >
    <AppInputText label="Name" v-model="uploadForm.name" />
    <!-- <AppInputText label="LOD" type="number" v-model="uploadForm.lod" /> -->
    <AppInputAutocomplete
      label="Category"
      :items="['road', 'building']"
      v-model="uploadForm.category"
    />
    <AppInputAutocomplete
      label="LOD"
      :items="[1, 2]"
      v-model="uploadForm.lod"
    />
    <AppInputText
      label="Center X (Longitude)"
      placeholder="ex: 117.0"
      type="number"
      v-model="uploadForm.center_x"
    />
    <AppInputText
      label="Center Y (Latitude)"
      placeholder="ex: 0.312"
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

  <AppDialogConfirm
    :confirm-loading="uploadLoading"
    v-model="deleteDialog"
    @close="deleteDialog = false"
    @confirm="confirmDelete3dTiles"
  >
  </AppDialogConfirm>
</template>
<script lang="ts" setup>
import tiles3DApi from "~/app/api/tiles3D.api";
import tiles3dConstant from "~/app/constant/3dTiles.constant";
const selectedId = ref();
const tiles3dStore = use3dTilesStore();
tiles3dStore.getAll3dTiles();
const uploadForm = ref<IUpload3dTilesPayload>({
  name: null,
  lod: 0,
  category: null,
  status: true,
  center_x: null,
  center_y: null,
  file: undefined,
});
const addDialog = ref(false);
const deleteDialog = ref(false);
const uploadLoading = ref(false);
const upload3dTiles = async () => {
  uploadLoading.value = true;
  await tiles3dStore.upload3dTiles({
    ...uploadForm.value,
  });
  await tiles3dStore.getAll3dTiles();
  addDialog.value = false;
  uploadLoading.value = false;
};
const delete3dTiles = async (item: any) => {
  deleteDialog.value = true;
  selectedId.value = item.id;
};
const confirmDelete3dTiles = async () => {
  uploadLoading.value = true;
  await tiles3dStore.delete3dTiles(selectedId.value);
  await tiles3dStore.getAll3dTiles();
  uploadLoading.value = false;
  deleteDialog.value = false;
};
const updateStatus = async (item: any) => {
  await tiles3DApi.edit_3d_tiles(item.id, {
    ...item,
    status: true,
  });
  console.log(item.id);
};
</script>
