<template>
  <DataLandParcelFilter />
  <AppTableData
    class="pt-0"
    title="Data Survey Lapangan (Persil Tanah)"
    :read-data="landParcelStore.readLandParcel"
    placeholder="Search by: NIB, NOP"
  >
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
          icon="mdi-map"
          icon-color="success"
          @click="seeLandParcel(item)"
        />
        <AppButtonIcon icon="mdi-pencil" />
        <AppButtonIcon
          icon="mdi-delete"
          icon-color="error"
          @click="deleteItem(item)"
        />
        <AppButtonIcon
          icon="mdi-eye"
          icon-color="secondary"
          @click="openDetail(item)"
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

  <AppDialog title="Land Parcel Survey" v-model="detailDialog" width="1920">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col>
            <v-img
              :src="selectedItem?.imageUrls[0]"
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
          </v-col>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Identitas wajib pajak"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.detailBapenda"
            />
          </v-col>

          <v-col cols="6">
            <AppCardDetailInformation
              title="Legalitas Tanah"
              :is-stacked="false"
              :value="selectedItem"
              :items="landParcelConstant.land_parcel_table.detailBpn"
            />
          </v-col>
          <v-col> </v-col>
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
const selectedItem = ref();
const dialog = ref(false);
const detailDialog = ref(false);
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
  await lotSurveyStore.deletePersil(selectedItem.value.id);
  landParcelStore.readLandParcel.getData({ page: 1, itemsPerPage: 10 });
  deleteDialog.value = false;
};
const router = useRouter();
const seeLandParcel = (item: any) => {
  const parameter = {
    lng: item.longitude,
    lat: item.latitude,
    uuid: item.uuid,
  };
  router.push({
    path: "/land_parcel_cesium",
    query: parameter,
  });
};
const openDetail = (item: IBuildingObjectType) => {
  detailDialog.value = true;
  selectedItem.value = item;
};
</script>
