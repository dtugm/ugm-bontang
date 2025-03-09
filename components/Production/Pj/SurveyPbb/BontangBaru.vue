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
        <v-btn class="text-none" color="tertiary" @click="addDialog = true"
          >Add Data</v-btn
        >
        <v-btn
          class="text-none"
          variant="outlined"
          color="green"
          :disabled="updateItem.length == 0"
          @click="updateDialog = true"
          >Bulk Update</v-btn
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
      <template #item.action="{ item }">
        <v-btn @click="openEditDialog(item)">Edit</v-btn> delete</template
      >
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

  <AppDialog v-model="addDialog">
    <v-card-text>
      <AppInputAutocomplete
        label="FID"
        :items="propertiesData"
        v-model="selectedFID"
        item-title="FID"
        return-object
        @update:model-value="assignValue"
      />
      <AppInputText label="Provinsi" v-model="formAddData.data.province" />
      <AppInputText label="Kota" v-model="formAddData.data.city" />
      <AppInputAutocomplete
        label="Kelurahan"
        v-model="formAddData.data.district"
        :items="['Bontang Baru', 'Api Api', 'Loktuan']"
      />
      <AppInputText label="Kecamatan" v-model="formAddData.data.village" />
      <AppInputText
        label="Alamat Objek Pajak"
        v-model="formAddData.data.taxObjectAddress"
      />
      <AppInputText
        label="Nama Wajib Pajak"
        v-model="formAddData.data.taxPayerName"
      />
      <AppInputAutocomplete
        label="Status"
        v-model="formAddData.data.status"
        :items="statusFeatureOptions"
      />
      <AppInputAutocomplete
        label="Tipe Bidang"
        v-model="formAddData.data.ownerType"
        :items="ownerTypeOptions"
      />
      <AppInputFileIBoxV2 v-model="formAddData.images" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="addDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Add"
          color="tertiary"
          @click="addDataBindang()"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
  <AppDialog v-model="editDialog">
    <v-card-text>
      {{ editFormData }}
      <AppInputText label="Provinsi" v-model="formAddData.data.province" />
      <AppInputText label="Kota" v-model="formAddData.data.city" />

      <AppInputAutocomplete
        label="Kelurahan"
        v-model="editFormData.data.district"
        :items="['Bontang Baru', 'Api Api', 'Loktuan']"
      />
      <AppInputText label="Kecamatan" v-model="editFormData.data.village" />
      <AppInputText
        label="Alamat Objek Pajak"
        v-model="editFormData.data.taxObjectAddress"
      />
      <AppInputText
        label="Nama Wajib Pajak"
        v-model="editFormData.data.taxPayerName"
      />
      <AppInputAutocomplete
        label="Status"
        v-model="editFormData.data.status"
        :items="statusFeatureOptions"
      />
      <AppInputAutocomplete
        label="Tipe Bidang"
        v-model="editFormData.data.ownerType"
        :items="ownerTypeOptions"
      />
      <AppInputFileIBoxV2 v-model="editFormData.images" />
      <v-img
        v-if="!editFormData.images"
        :src="editFormData.data.imageUrls[0]"
      ></v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="editDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Submit"
          color="tertiary"
          @click="submitEdit()"
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

const fetchAllData = async () => {
  isTableLoading.value = true;
  await surveyStore.getBidangTanahBontangBaru();
  isTableLoading.value = false;
  items.value = surveyStore.bidangTanahBontangBaruItems;
};
onMounted(async () => {
  const properties = await addGeoJsonProperties(
    "/SurveyPbb/peta_kerja_bontang_baru.geojson"
  );
  fetchAllData();
  propertiesData.value = properties;
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
  fetchAllData();
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
const basicForm = {
  images: null,
  data: {
    fid: "",
    polygonId: "",
    province: "Kalimantan Timur",
    city: "Bontang",
    district: "Bontang Baru",
    village: null,
    taxObjectAddress: "",
    taxPayerName: "",
    status: null,
    ownerType: null,
  },
};
const addDialog = ref(false);
const formAddData = ref(basicForm);

const assignValue = (value: any) => {
  if (value) {
    formAddData.value.data.fid = value.FID;
    formAddData.value.data.polygonId = value.ID;
    formAddData.value.data.taxObjectAddress = value.ALAMAT_OP;
    formAddData.value.data.taxPayerName = value.ALAMAT_WP;
  }
};
const selectedFID = computed({
  get: () =>
    propertiesData.value.find(
      (item: any) => item.FID === formAddData.value.data.fid
    ) || null,
  set: (val) => {
    if (val) {
      assignValue(val);
    }
  },
});
const addDataBindang = async () => {
  await surveyStore.postBidangTanahBontangBaru(formAddData.value);
  fetchAllData();
  addDialog.value = false;
  formAddData.value = basicForm;
};

const editDialog = ref(false);
const editFormData = ref({
  ...basicForm,
  data: { ...basicForm.data, imageUrls: "" },
});
const openEditDialog = (item: any) => {
  const {
    ALAMAT_OP,
    ALAMAT_WP,
    DATE_UPDT,
    FID,
    F_WWC,
    ID,
    JML_BGN,
    JML_KDR2,
    JML_KDR4,
    KECAMATAN,
    KELURAHAN,
    L_BUMI,
    NIK_WP,
    NOP_BARU,
    TIPEHAK,
    UPDATE,
    VALIDATOR,
    ...api
  } = item;
  editFormData.value.data = api;
  editDialog.value = true;
};
const submitEdit = async () => {
  await surveyStore.putBidangTanahBontangBaru(editFormData.value);
};
</script>
