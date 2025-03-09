<template>
  <v-container>
    <v-row>
      <v-col lg="12"
        ><AppInputAutocomplete
          v-model="statusFilter"
          @update:model-value="filterByStatus"
          label="Status"
          is-filter
          :items="[
            { title: 'Sudah disurvey', value: true },
            { title: 'Belum disurvey', value: false },
          ]"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row no-gutters class="items-center gap-4">
      <AppTextH5 color="primary"> Update Status Survey</AppTextH5>
      <div class="flex gap-2">
        <v-btn
          class="text-none"
          variant="outlined"
          color="green"
          :disabled="updateItem.length == 0"
          @click="updateDialog = true"
          >Update</v-btn
        >
        <v-btn
          class="text-none"
          variant="outlined"
          color="error"
          :disabled="updateItem.length == 0"
          @click="undoDialog = true"
          >Undo</v-btn
        >
      </div>
      <v-spacer></v-spacer>

      <v-col lg="3">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          placeholder="Search..."
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-data-table
      v-model="updateItem"
      show-select
      class="h-[calc(100vh-124px-50px)] header-theme"
      :headers="SurveyLapanganConstant.BindagTanahHeader"
      :items="filteredItems"
      item-key="name"
      :search="search"
      items-per-page="15"
      fixed-footer
      fixed-header
      return-object
      :loading="isTableLoading"
    >
      <template #item.status="{ item }: any">
        <v-chip :color="statusColorMap[item.status]" v-if="item.status">{{
          statusMap[item.status]
        }}</v-chip>
      </template>
      <template #item.action> Edit, delete</template>
    </v-data-table>
  </v-container>

  <AppDialog v-model="updateDialog" title="Update Persil" width="500">
    <v-card-text>
      <AppInputAutocomplete
        label="Status"
        v-model="statusFeature"
        :items="statusFeatureOptions"
      />
      <AppInputAutocomplete
        label="Tipe Bidang"
        v-model="ownerType"
        :items="ownerTypeOptions"
      />
      <v-card-actions>
        Pastikan data yang akan ubah sudah benar
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="updateDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Update"
          color="success"
          @click="updatePersil()"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
  <AppDialog v-model="undoDialog" title="Undo Status Bidang" width="500">
    <AppInputAutocomplete />
    <v-card-text>
      Pastikan data yang akan ubah sudah benar
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="undoDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Undo"
          color="error"
          @click="updatePersil()"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
</template>
<script lang="ts" setup>
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
const surveyStore = useSurveyStore();
const isTableLoading = ref(false);
const items = ref([]);
const propertiesData = ref([]);
const ownerTypeOptions = SurveyLapanganConstant.ownerTypeOptions;
const statusFeatureOptions = SurveyLapanganConstant.statusFeatureOptions;
const statusMap: any = SurveyLapanganConstant.statusMap;
const statusColorMap: any = SurveyLapanganConstant.statusColorMap;
onMounted(async () => {
  const properties = await addGeoJsonProperties(
    "/SurveyPbb/peta_kerja_bontang_baru.geojson"
  );
  isTableLoading.value = true;
  await surveyStore.getBidangTanahBontangBaru();
  isTableLoading.value = false;
  propertiesData.value = properties;
  items.value = surveyStore.bidangTanahBontangBaruItems;
  surveyStore.totalObject.bontang_baru == properties.length;
});
const filterByStatus = (value: any) => {
  if (value) {
    // items.value = surveyStore.bidangTanahData;
  } else {
    items.value = propertiesData.value;
  }
};
const updateItem = ref([]);
const search = ref("");
const updateDialog = ref(false);
const undoDialog = ref(false);
const statusFilter = ref(null);
const statusFeature = ref();
const ownerType = ref();
const updatePersil = async () => {
  const payload = updateItem.value.map((item: any) => {
    return {
      fid: String(item.FID),
      province: "Kalimantan Timur",
      polygonId: item.ID,
      taxPayerName: item.ALAMAT_WP ?? "need to be Update",
      taxObjectAddress: item.ALAMAT_OP ?? "need to be Update",
      status: statusFeature.value,
      ownerType: ownerType.value,
    };
  });
  await surveyStore.addUpdatedBulkFeature(payload);
  updateItem.value = [];
  updateDialog.value = false;
  undoDialog.value = false;
};

const filteredItems = computed(() => {
  if (!items.value.length) return [];
  return items.value.filter((item: any) =>
    item.FID.toString().includes(search.value.toLowerCase())
  );
});
// surveyStore.getAllDoneBidangTanah();
const isPersilDone = (id: any) => {
  return surveyStore.bidangTanahData.some((item: any) => {
    return item.fid === String(id);
  });
};
</script>
