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
        <AppButtonIcon icon="mdi-pencil" />
        <AppButtonIcon icon="mdi-delete" @click="deleteItem(item)" />
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
</template>
<script lang="ts" setup>
import buildingSurveyMonitoringsApi from "~/app/api/survey/buildingSurveyMonitorings.api";
const landParcelStore = useLandParcelStore();
const lotSurveyStore = useLotSurveyMonitoring();
const imageUrlPreview = ref();
const selectedItem = ref();
const dialog = ref(false);
const previewImage = (item: any) => {
  dialog.value = true;
  selectedItem.value = item;
  imageUrlPreview.value = item.imageUrls[0];
};

const addLandParcel = () => {
  navigateTo("/data/add_land_parcel");
};
const testFunction = async () => {
  const resp =
    await buildingSurveyMonitoringsApi.get_building_survey_monitoring();
  console.log(resp);
};

const deleteLoading = ref(false);
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
</script>
