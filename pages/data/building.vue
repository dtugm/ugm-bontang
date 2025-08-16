<template>
  <DataBuildingFilter />
  <AppTableData
    placeholder="Cari berdasarkan Nama, NOP, NOP Bangunan"
    title="Data Survey Bangunan"
    :read-data="buildingStore.readBuildingData"
  >
    <template #action>
      <v-btn color="success" :loading="isDownloading" @click="downloadExcel"
        >Download Dokumen</v-btn
      >
    </template>
    <template #item.luasBgnLama="{ item }">
      <v-chip v-if="Number(item.luasBgnLama)" color="primary-blue">
        {{ item.luasBgnLama }} m<sup>2</sup>
      </v-chip>
    </template>
    <template #item.luasBgn="{ item }">
      <v-chip
        density="comfortable"
        v-if="Number(item.luasBgn)"
        color="primary-blue"
      >
        {{ item.luasBgn }} m<sup>2</sup>
      </v-chip>
    </template>
    <template
      #item.buildingFloorType="{
        item,
      }: {
        item: { buildingFloorType: BuildingFloorType },
      }"
    >
      <v-chip
        density="comfortable"
        :color="floorColorMap[item.buildingFloorType]"
        label
      >
        {{ floorTypeMap[item.buildingFloorType] ?? "-" }}
      </v-chip>
    </template>
    <template
      #item.buildingType="{ item }: { item: { buildingType: BuildingType } }"
    >
      <v-chip
        :append-icon="buildingTypeIconMap[item.buildingType]"
        density="comfortable"
        :color="buildingTypeColorMap[item.buildingType]"
        label
      >
        {{ buildingTypeMap[item.buildingType] ?? "-" }}
      </v-chip>
    </template>
    <template #item.update="{ item }: { item: { update: BuildingUpdate } }">
      <v-chip
        density="comfortable"
        :color="buildingUpdateColorMap[item.update]"
        label
      >
        {{ buildingUpdateMap[item.update] ?? "-" }}
      </v-chip>
    </template>
    <template #item.roofType="{ item }: { item: { roofType: RoofType } }">
      <v-chip
        density="comfortable"
        :color="roofTypeColorMap[item.roofType]"
        label
      >
        {{ item.roofType ?? "-" }}
      </v-chip>
    </template>
    <template
      #item.buildingWall="{ item }: { item: { buildingWall: BuildingWall } }"
    >
      <v-chip
        density="comfortable"
        :color="wallTypeColorMap[item.buildingWall]"
        label
      >
        {{ wallTypeMap[item.buildingWall] ?? "-" }}
      </v-chip>
    </template>
    <template
      #item.buildingConstruction="{
        item,
      }: {
        item: { buildingConstruction: BuildingConstruction },
      }"
    >
      <v-chip
        density="comfortable"
        :color="buildingConstructionColorMap[item.buildingConstruction]"
        label
      >
        {{ buildingConstructionMap[item.buildingConstruction] ?? "-" }}
      </v-chip>
    </template>
    <template #item.action="{ item }">
      <div>
        <AppButtonIcon icon="mdi-eye" @click="openDetail(item)" />
        <AppButtonIcon
          v-if="item.longBgn != '-' && item.latBgn != '-'"
          icon="mdi-map"
          icon-color="success"
          @click="seeLandParcel(item)"
        />

        <AppButtonIcon icon="mdi-pencil" @click="openEdit(item)" />
        <AppButtonIcon
          icon="mdi-delete"
          icon-color="error"
          @click="deleteItem(item)"
        />
      </div>
    </template>
  </AppTableData>
  <AppDialog title="Detail Survey" v-model="detailDialog" width="1920">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Identias Bangunan"
              :is-stacked="false"
              :value="selectedItem"
              :items="buildingDataConstant.detail_item.identitas"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Wajib Pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="buildingDataConstant.detail_item.wajibPajak"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Lokasi"
              :is-stacked="false"
              :value="selectedItem"
              :items="buildingDataConstant.detail_item.lokasi"
            />
          </v-col>

          <v-col cols="6">
            <AppCardDetailInformation
              title="Bangunan"
              :is-stacked="false"
              :value="selectedItem"
              :items="buildingDataConstant.detail_item.bangunan"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Metadata"
              :is-stacked="false"
              :value="selectedItem"
              :items="buildingDataConstant.detail_item.metadata"
            />
          </v-col>
          <v-col cols="6">
            <AppCardContainerBorder
              title="Gambar Survey"
              v-if="selectedItem?.imageUrls[0]"
            >
              <v-img
                aspect-ratio="16/9"
                :src="selectedItem?.imageUrls[0]"
                height="500"
                contain
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                </template>
                <template #error>
                  <div
                    class="d-flex align-center justify-center fill-height grey lighten-2"
                  >
                    <span>Gambar tidak tersedia</span>
                  </div>
                </template>
              </v-img>
            </AppCardContainerBorder>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </AppDialog>

  <!-- Delete -->
  <AppDialogConfirm
    :confirm-loading="buildingStore.deleteBuildingLoading"
    v-model="deleteDialog"
    @close="deleteDialog = false"
    @confirm="confirmDelete"
  >
  </AppDialogConfirm>

  <!-- Edit -->
  <AppDialogConfirm
    :confirm-loading="buildingStore.editBuildingLoading"
    v-model="editDialog"
    confirm-color="tertiary"
    confirm-text="Update"
    @close="editDialog = false"
    @confirm="confirmEdit"
    width="1200"
  >
    <v-row v-if="selectedItem">
      <v-col cols="6">
        <AppInputText label="NOP" v-model="selectedItem.taxObjectNumber" />
        <AppInputText label="Alamat" v-model="selectedItem.address" />
        <AppInputText
          label="Nama Pemilik"
          v-model="selectedItem.taxPayerName"
        />
        <v-row>
          <v-col>
            <AppInputText
              label="Luas Bangunan Lama (m²)"
              v-model="selectedItem.luasBgnLama"
              type="number"
            />
          </v-col>
          <v-col>
            <AppInputText
              label="Luas Bangunan (m²)"
              v-model="selectedItem.luasBgn"
              type="number"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <AppInputText label="RT" v-model="selectedItem.rt" type="number" />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              label="Kelurahan"
              :items="lotSurveyStore.kelurahanOption"
              v-model="selectedItem.village"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <AppInputText
              label="Longitude"
              placeholder="117.492109"
              v-model="selectedItem.longBgn"
              type="number"
            />
          </v-col>

          <v-col>
            <AppInputText
              label="Latitude"
              placeholder="0.13754"
              v-model="selectedItem.latBgn"
              type="number"
            />
          </v-col>
        </v-row>
        <AppInputText label="UUID Bangunan" v-model="selectedItem.fid" />
        <v-row>
          <v-col cols="6">
            <AppInputAutocomplete
              :items="buildingStore.buildingUpdateOptions"
              label="Status Survey"
              v-model="selectedItem.update"
            />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              :items="buildingStore.buildingTypeOptions"
              label="Tipe Bangunan"
              v-model="selectedItem.buildingType"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <AppInputAutocomplete
              :items="buildingStore.wallTypeOptions"
              label="Tipe Dinding"
              v-model="selectedItem.buildingWall"
            />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              :items="buildingStore.buildingConstructionOptions"
              label="Tipe Konstruksi"
              v-model="selectedItem.buildingConstruction"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <AppInputAutocomplete
              :items="buildingStore.floorTypeOptions"
              label="Tipe Lantai"
              v-model="selectedItem.buildingFloorType"
            />
          </v-col>
          <v-col>
            <AppInputAutocomplete
              :items="buildingStore.roofTypeOptions"
              label="Tipe Roof"
              v-model="selectedItem.roofType"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <AppInputFileIBoxV2
          file-type="img"
          v-model="imageForm"
          :preview_img="selectedItem?.imageUrls[0]"
        />
      </v-col>
    </v-row>
  </AppDialogConfirm>
</template>
<script setup lang="ts">
import {
  BuildingFloorType,
  BuildingUpdate,
  BuildingType,
  BuildingWall,
  RoofType,
  BuildingConstruction,
} from "~/app/types/enums/building";
import {
  wallTypeMap,
  floorTypeMap,
  buildingTypeMap,
  buildingUpdateMap,
  floorColorMap,
  buildingTypeColorMap,
  buildingUpdateColorMap,
  wallTypeColorMap,
  roofTypeColorMap,
  buildingTypeIconMap,
  buildingConstructionMap,
  buildingConstructionColorMap,
} from "~/app/constant/data/buildingMapping.constant";
import buildingDataConstant from "~/app/constant/buildingData.constant";
const dataStore = useDataStore();
const buildingStore = useBuildingDataStore();
const lotSurveyStore = useLotSurveyMonitoring();
const selectedItem: any = ref<IBuildingObjectType>();
const detailDialog = ref(false);
const deleteDialog = ref(false);
const editDialog = ref(false);
const openDetail = (item: IBuildingObjectType) => {
  detailDialog.value = true;
  selectedItem.value = item;
};
const deleteItem = (item: any) => {
  deleteDialog.value = true;
  selectedItem.value = item;
};
const confirmDelete = async () => {
  if (selectedItem.value) {
    await buildingStore.deleteBuildingData(selectedItem.value.id);
  }
  buildingStore.readBuildingData.getData({ page: 1, itemsPerPage: 10 });
  deleteDialog.value = false;
};

const cleanItem: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return obj.map((val) => cleanItem(val));
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [key, cleanItem(val)])
    );
  } else {
    return obj === "-" ? null : obj;
  }
};

const openEdit = (item: ILotSurveyItems) => {
  const cleanedItem = cleanItem(item);
  editDialog.value = true;
  selectedItem.value = cleanedItem;
};
const imageForm = ref(null);
const confirmEdit = async () => {
  if (selectedItem.value) {
    const { id, createdAt, updatedAt, ...itemPayload } = selectedItem.value;
    await buildingStore.editBuilding(selectedItem.value.id, {
      data: {
        ...itemPayload,
      },
      images: imageForm.value,
    });
  }
  buildingStore.readBuildingData.getData({ page: 1, itemsPerPage: 10 });
  editDialog.value = false;
  imageForm.value = null;
};
const router = useRouter();
const seeLandParcel = (item: any) => {
  const cleanedItem = cleanItem(item);
  const parameter: Record<string, any> = {
    lng: cleanedItem.longBgn,
    lat: cleanedItem.latBgn,
    uuid_bgn: cleanedItem.fid,
  };
  Object.keys(parameter).forEach((key) => {
    if (parameter[key] == null) {
      delete parameter[key];
    }
  });
  router.push({
    path: "/land_parcel_cesium",
    query: parameter,
  });
};
const isDownloading = ref(false);
const downloadExcel = async () => {
  isDownloading.value = true;
  await dataStore.exportBuildingSurveyExcel(
    buildingStore.readBuildingData.filterData
  );
  isDownloading.value = false;
};
// const imageSrc = ref(selectedItem?.value.imageUrls[0] || "");
// const imageFailed = ref(false);
// const hasImage = computed(() => {
//   return imageSrc.value && !imageFailed.value;
// });

// function onImageError() {
//   imageFailed.value = true;
// }
</script>
