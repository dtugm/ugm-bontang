<template>
  <!-- Filter -->
  <v-container>
    <v-row>
      <v-col>
        <AppInputAutocomplete label="Category" is-filter hide-details />
      </v-col>
      <v-col>
        <AppInputAutocomplete label="Data Source" is-filter hide-details />
      </v-col>
      <v-col cols="auto">
        <AppButton color="tertiary" label="Filter" />
      </v-col>
    </v-row>
  </v-container>

  <!-- Table View -->
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
        @click="add3dTiles"
        >Add
      </v-btn>
    </template>

    <template #item.category="{ item }">
      <v-chip
        :append-icon="categoryIconMap[item.category]"
        density="comfortable"
        :color="categoryColorMap[item.category]"
      >
        {{ stringHelper.titleCase(item.category) }}
      </v-chip>
    </template>
    <template #item.status="{ item }">
      <v-chip density="comfortable" :color="item.status ? 'success' : 'error'">
        {{ item.status ? "Active" : "Not Active" }}
      </v-chip>
    </template>
    <template #item.texture="{ item }">
      <v-chip density="comfortable" color="tertiary">
        {{ item.texture ? "Textured" : "Basic" }}
      </v-chip>
    </template>
    <template #item.status_action="{ item }">
      <v-switch
        inset
        color="success"
        density="compact"
        :label="item.status"
        v-model="item.status"
        hide-details
        @update:model-value="updateStatus(item)"
      />
    </template>
    <template #item.action="{ item }">
      <v-btn
        icon
        variant="flat"
        rounded="sm"
        density="compact"
        @click="edit3dTiles(item)"
      >
        <v-icon color="tertiary">mdi-pencil</v-icon>
      </v-btn>
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
    width="920"
    title="Add New 3D Tiles"
    close-text="Cancel"
    confirm-text="Add"
    confirm-color="tertiary"
    :confirm-loading="uploadLoading"
    v-model="addDialog"
    @confirm="upload3dTiles"
    @close="addDialog = false"
  >
    <v-row>
      <v-col cols="6">
        <AppInputText label="Name" v-model="uploadForm.name" />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="Category"
          :items="model3d.categoryType"
          v-model="uploadForm.category"
        />
      </v-col>
      <v-col cols="6">
        <AppInputText
          label="Center X (Longitude)"
          placeholder="ex: 117.0"
          type="number"
          v-model="uploadForm.center_x"
        />
      </v-col>
      <v-col cols="6">
        <AppInputText
          label="Center Y (Latitude)"
          placeholder="ex: 0.312"
          type="number"
          v-model="uploadForm.center_y"
        />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="LOD"
          :items="[1, 2, 3]"
          v-model="uploadForm.lod"
        />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="Terrain"
          :items="model3d.clamp_options"
          v-model="uploadForm.clamp"
        />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="Terrain"
          :items="model3d.sourceOptions"
          v-model="uploadForm.source"
        />
      </v-col>
      <v-col cols="3">
        <v-label>Status</v-label>
        <v-switch
          color="success"
          inset
          :label="uploadForm.status ? `Active` : 'Non Active'"
          hide-details
          v-model="uploadForm.status"
      /></v-col>
      <v-col cols="3">
        <v-label>Texture</v-label>
        <v-switch
          color="success"
          inset
          :label="uploadForm.texture ? `Texture` : 'Non Textured'"
          hide-details
          v-model="uploadForm.texture"
        />
      </v-col>
    </v-row>

    <AppInputFileIBoxV2
      v-if="uploadForm.source == 'AWS'"
      v-model="uploadForm.file"
    />
    <AppInputText
      label="Asset ID"
      v-if="uploadForm.source == 'CESIUM'"
      v-model="uploadForm.assetId"
    />
  </AppDialogConfirm>

  <AppDialogConfirm
    :confirm-loading="uploadLoading"
    v-model="deleteDialog"
    @close="deleteDialog = false"
    @confirm="confirmDelete3dTiles"
  >
  </AppDialogConfirm>

  <AppDialogConfirm
    width="920"
    title="Edit 3D Tiles"
    close-text="Cancel"
    confirm-text="Update"
    confirm-color="tertiary"
    :confirm-loading="uploadLoading"
    v-model="editDialog"
    @confirm="confirmEdit3dTiles"
    @close="editDialog = false"
  >
    <v-row>
      <v-col cols="6">
        <AppInputText label="Name" v-model="editForm.name" />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="Category"
          :items="model3d.categoryType"
          v-model="editForm.category"
        />
      </v-col>
      <v-col cols="6">
        <AppInputText
          label="Center X (Longitude)"
          placeholder="ex: 117.0"
          type="number"
          v-model="editForm.center_x"
        />
      </v-col>
      <v-col cols="6">
        <AppInputText
          label="Center Y (Latitude)"
          placeholder="ex: 0.312"
          type="number"
          v-model="editForm.center_y"
        />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="LOD"
          :items="[1, 2, 3]"
          v-model="editForm.lod"
        />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="Terrain"
          :items="model3d.clamp_options"
          v-model="editForm.clamp"
        />
      </v-col>
      <v-col cols="6">
        <AppInputAutocomplete
          label="Data Source"
          :items="model3d.sourceOptions"
          v-model="editForm.source"
        />
      </v-col>
      <v-col cols="3">
        <v-label>Status</v-label>
        <v-switch
          color="success"
          inset
          :label="editForm.status ? `Active` : 'Non Active'"
          hide-details
          v-model="editForm.status"
      /></v-col>
      <v-col cols="3">
        <v-label>Texture</v-label>
        <v-switch
          color="success"
          inset
          :label="editForm.texture ? `Texture` : 'Non Textured'"
          hide-details
          v-model="editForm.texture"
        />
      </v-col>
    </v-row>

    <AppInputFileIBoxV2
      v-if="editForm.source == 'AWS'"
      v-model="editForm.file"
    />
    <AppInputText
      label="Asset ID"
      v-if="editForm.source == 'CESIUM'"
      v-model="editForm.assetId"
    />
  </AppDialogConfirm>
</template>
<script lang="ts" setup>
import tiles3DApi from "~/app/api/tiles3D.api";
import tiles3dConstant from "~/app/constant/3dTiles.constant";
import stringHelper from "~/app/helper/string.helper";
import model3d from "~/app/constant/management/model3dManagement.constant";
const appStore = useAppStore();
const selectedId = ref();
const tiles3dStore = use3dTilesStore();
tiles3dStore.getAll3dTiles();
const uploadForm: any = ref<IUpload3dTilesPayload | null>(null);
const addDialog = ref(false);

const add3dTiles = () => {
  addDialog.value = true;
  uploadForm.value = {
    name: null,
    lod: 0,
    category: null,
    status: true,
    texture: false,
    center_x: null,
    center_y: null,
    file: undefined,
    source: "AWS",
    assetId: null,
  };
};
const deleteDialog = ref(false);
const uploadLoading = ref(false);
const upload3dTiles = async () => {
  uploadLoading.value = true;
  const { assetId, file, source, ...item } = uploadForm.value;
  if (source == "AWS") {
    const awsPayload = {
      ...item,
      file,
      source,
    };
    await tiles3dStore.upload3dTiles(awsPayload);
  } else if (source == "CESIUM") {
    const cesiumPayload = {
      ...item,
      assetId,
      source,
    };
    await tiles3dStore.upload3dTiles(cesiumPayload);
  }
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
const editDialog = ref(false);
const editForm: any = ref({});
const edit3dTiles = async (item: any) => {
  editDialog.value = true;
  editForm.value = JSON.parse(JSON.stringify(item));
  selectedId.value = item.id;
};
const confirmEdit3dTiles = async () => {
  uploadLoading.value = true;
  await tiles3dStore.update3dTiles({ id: selectedId.value }, editForm.value);
  await tiles3dStore.getAll3dTiles();
  uploadLoading.value = false;
  editDialog.value = false;
};

const updateStatus = async (item: any) => {
  console.log(item);
  await tiles3DApi
    .edit_3d_tiles(item.id, {
      ...item,
    })
    .then(() => {
      appStore.toastSuccess(
        `Model 3D berhasil ${item.status ? "diaktifkan" : "dinonaktifkan"}`
      );
    })
    .catch(() => {
      appStore.toastError("Gagal Mengupdate Data :(");
    })
    .finally(() => {
      tiles3dStore.getAll3dTiles();
    });
};

const categoryIconMap: any = {
  building: "mdi-home-city",
  road: "mdi-road-variant",
  vegetation: "mdi-palm-tree",
  landmark: "mdi-city",
};
const categoryColorMap: any = {
  building: "primary-blue",
  road: "secondary",
  vegetation: "success",
  landmark: "primary",
};
</script>
