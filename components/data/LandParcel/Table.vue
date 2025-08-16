<template>
  <v-col>
    <v-chip color="primary" label>
      Total Land Parcel:
      {{ landParcelStore.readLandParcel.tableData.totalItems }}
    </v-chip>
  </v-col>
  <DataLandParcelFilter class="pb-0" />

  <AppTableData
    class="pt-0"
    title="Data Survey Lapangan (Persil Tanah)"
    :read-data="landParcelStore.readLandParcel"
    placeholder="Cari berdasarkan Nama, NOP, NIB"
  >
    <template #action>
      <v-btn color="success" :loading="isDownloading" @click="downloadExcel"
        >Download Dokumen</v-btn
      >
    </template>
    <template #item.l_bumi="{ item }">
      <v-chip density="comfortable" color="primary-blue">
        {{ Number(item.l_bumi).toFixed(2) }} m<sup>2</sup>
      </v-chip>
    </template>
    <template #item.image="{ item }">
      <a
        v-if="item.imageUrls.length !== 0"
        class="underline text-primary-blue hover:cursor-pointer"
        @click="previewImage(item)"
      >
        see image
      </a>
    </template>
    <template #item.action="{ item }">
      <div>
        <AppButtonIcon
          icon="mdi-eye"
          icon-color="secondary"
          @click="openDetail(item)"
        />
        <AppButtonIcon
          v-if="item.longitude != '-' && item.latitude != '-'"
          icon="mdi-map"
          icon-color="success"
          @click="flyToBuilding(item)"
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
  <AppDialog
    :title="`${selectedItem?.nib} || ${selectedItem?.typeOfRight} `"
    v-model="dialog"
  >
    <v-card-text>
      <v-img
        :src="imageUrlPreview"
        aspect-ratio="1"
        class="bg-grey-lighten-3"
        cover
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </template>
      </v-img>
    </v-card-text>
  </AppDialog>
  <AppDialogConfirm
    :confirm-loading="lotSurveyStore.deletePersilLoading"
    v-model="deleteDialog"
    @close="deleteDialog = false"
    @confirm="confirmDelete"
  >
  </AppDialogConfirm>

  <AppDialogConfirm
    :confirm-loading="lotSurveyStore.editPersilLoading"
    v-model="editDialog"
    confirm-color="tertiary"
    confirm-text="Update"
    @close="editDialog = false"
    @confirm="confirmEdit"
    width="900"
  >
    <v-row v-if="selectedItem">
      <v-col cols="6">
        <!-- <AppInputText label="NOP" v-model="selectedItem.taxObjectNumber" /> -->
        <AppInputText label="NIB" v-model="selectedItem.nib" />
        <AppInputText label="NOP" v-model="selectedItem.taxObjectNumber" />
        <AppInputText label="Alamat" v-model="selectedItem.taxObjectAddress" />
        <AppInputText label="Jenis Hak" v-model="selectedItem.typeOfRight" />
        <AppInputText
          label="Nama Pemilik"
          v-model="selectedItem.taxPayerName"
        />
        <v-row>
          <v-col>
            <AppInputText
              label="Luas Bumi (m²)"
              v-model="selectedItem.l_bumi"
              type="number"
            />
          </v-col>
          <v-col>
            <AppInputText
              label="Luas Tertulis (m²)"
              v-model="selectedItem.l_tertul"
              type="number"
            />
          </v-col>
        </v-row>
        <AppInputAutocomplete
          label="Jenis Tanah"
          :items="lotSurveyStore.landTypeOptions"
          v-model="selectedItem.landType"
        />
        <AppInputAutocomplete
          label="STAWPOP"
          :items="lotSurveyStore.staWpopOptions"
          v-model="selectedItem.staWpop"
        />
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
              v-model="selectedItem.longitude"
              type="number"
            />
          </v-col>
          <v-col>
            <AppInputText
              label="Latitude"
              placeholder="0.13754"
              v-model="selectedItem.latitude"
              type="number"
            />
          </v-col>
        </v-row>
        <AppInputText label="UUID Persil" v-model="selectedItem.fid" />
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

  <AppDialog title="Land Parcel Survey" v-model="detailDialog" width="1920">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Identitas wajib pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.identitasWp"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.pajak"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Identitas wajib pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.kepemilikan"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.pekerjaan"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Identitas wajib pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.kendaraan"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.identitasBidang"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Identitas wajib pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.luas"
            />
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.penggunaan"
            />
          </v-col>
          <v-col cols="12">
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
</template>
<script lang="ts" setup>
import landParcelConstant from "~/app/constant/landParcel.constant";

const landParcelStore = useLandParcelStore();
const lotSurveyStore = useLotSurveyMonitoring();
const imageUrlPreview = ref();
const selectedItem = ref<ILotSurveyItems>();
const dialog = ref(false);
const detailDialog = ref(false);
const editDialog = ref(false);
const previewImage = (item: any) => {
  dialog.value = true;
  selectedItem.value = item;
  imageUrlPreview.value = item.imageUrls[0];
};
const deleteDialog = ref(false);
const deleteItem = (item: any) => {
  deleteDialog.value = true;
  selectedItem.value = item;
};
const confirmDelete = async () => {
  if (selectedItem.value) {
    await lotSurveyStore.deletePersil(selectedItem.value.id);
  }
  landParcelStore.readLandParcel.getData({ page: 1, itemsPerPage: 10 });
  deleteDialog.value = false;
};
const router = useRouter();
const seeLandParcel = (item: any) => {
  const cleanedItem = cleanItem(item);
  const parameter: Record<string, any> = {
    lng: cleanedItem.longitude,
    lat: cleanedItem.latitude,
    uuid: cleanedItem.uuid,
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
const openDetail = (item: ILotSurveyItems) => {
  detailDialog.value = true;
  selectedItem.value = item;
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
    await lotSurveyStore.editPersil(selectedItem.value.id, {
      data: {
        ...itemPayload,
      },
      images: imageForm.value,
    });
  }
  landParcelStore.readLandParcel.getData({ page: 1, itemsPerPage: 10 });
  editDialog.value = false;
  imageForm.value = null;
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
const dataStore = useDataStore();
const isDownloading = ref(false);
const downloadExcel = async () => {
  isDownloading.value = true;
  await dataStore.exportLandSurveyExcel(
    landParcelStore.readLandParcel.filterData
  );
  isDownloading.value = false;
};
const viewerStore = useViewerLandParcelStore();
const flyToLocation = inject("flyToLocation") as (item: any) => void;
const closeMenu = inject("closeMenu") as () => void;
const flyToBuilding = (item: any) => {
  viewerStore.isBuildingActive = false;
  flyToLocation?.({
    center_x: Number(item.longitude),
    center_y: Number(item.latitude),
  });
  closeMenu?.();
};
</script>
