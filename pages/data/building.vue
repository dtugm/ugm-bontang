<template>
  <DataBuildingFilter />
  <AppTableData
    placeholder="Search By NOP"
    title="Data Survey Bangunan"
    :read-data="buildingStore.readBuildingData"
  >
    <template #item.luasBgn="{ item }">
      <v-chip v-if="Number(item.luasBgn)" color="primary-blue">
        {{ item.luasBgn }} m<sup>2</sup>
      </v-chip>
      <p v-else>to be updated</p>
    </template>
    <template #item.luasBgnBaru="{ item }">
      <v-chip
        density="comfortable"
        v-if="Number(item.luasBgnBaru)"
        color="primary-blue"
      >
        {{ item.luasBgnBaru }} m<sup>2</sup>
      </v-chip>
      <p v-else>to be updated</p>
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
      >
        {{ buildingTypeMap[item.buildingType] ?? "-" }}
      </v-chip>
    </template>
    <template #item.update="{ item }: { item: { update: BuildingUpdate } }">
      <v-chip
        density="comfortable"
        :color="buildingUpdateColorMap[item.update]"
      >
        {{ buildingUpdateMap[item.update] ?? "-" }}
      </v-chip>
    </template>
    <template #item.roofType="{ item }: { item: { roofType: RoofType } }">
      <v-chip density="comfortable" :color="roofTypeColorMap[item.roofType]">
        {{ item.roofType ?? "-" }}
      </v-chip>
    </template>
    <template
      #item.buildingWall="{ item }: { item: { buildingWall: BuildingWall } }"
    >
      <v-chip
        density="comfortable"
        :color="wallTypeColorMap[item.buildingWall]"
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
      >
        {{ buildingConstructionMap[item.buildingConstruction] ?? "-" }}
      </v-chip>
    </template>
    <template #item.action="{ item }">
      <AppButtonIcon icon="mdi-eye" @click="openDetail(item)" />
    </template>
  </AppTableData>
  <AppDialog title="Detail Survey" v-model="detailDialog" width="1920">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <AppCardDetailInformation
              title="Building Attribute"
              :is-stacked="false"
              :value="selectedItem"
              :items="itemsBpn"
            />
          </v-col>
          <v-col cols="6">
            <v-img
              height="200"
              aspect-ratio="1"
              :src="selectedItem?.imageUrls[0]"
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
            <AppCardDetailInformation
              title="Building Attribute"
              :is-stacked="false"
              :value="selectedItem"
              :items="itemsBapenda"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </AppDialog>
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
const buildingStore = useBuildingDataStore();
const selectedItem = ref();
const detailDialog = ref(false);
const openDetail = (item: IBuildingObjectType) => {
  detailDialog.value = true;
  selectedItem.value = item;
};
const itemsBpn = {
  buildingConstruction: "Konstruksi Bangunan",
  buildingFloorType: "Jenis Lantai",
  buildingType: "Tipe Bangunan",
  buildingWall: "Dinding Bangunan",
  city: "Kota",
  district: "Kecamatan",
  dtmMean: "Rata-rata DTM",
  electricity: "Daya Listrik (VA)",
  floorCount: "Jumlah Lantai",
  latBgn: "Latitude Bangunan",
  longBgn: "Longitude Bangunan",
  luasBgn: "Luas Bangunan (m²)",
  luasBgnBaru: "Luas Bangunan Baru (m²)",
  luasBgnLama: "Luas Bangunan Lama (m²)",
  province: "Provinsi",
  roofType: "Jenis Atap",
  rt: "RT",
  rw: "RW",
  toponimi: "Toponimi",
  village: "Desa/Kelurahan",
};

const itemsBapenda = {
  createdAt: "Tanggal Dibuat",
  dateUpdt: "Tanggal Diperbarui (Sumber)",
  fid: "FID",
  id: "ID",
  nopBgn: "NOP Bangunan",
  ownerType: "Jenis Pemilik",
  status: "Status Survey",
  taxObjectNumber: "Nomor Objek Pajak",
  taxObjectCode_1: "Kode Objek Pajak 1",
  taxPayerCode: "Kode Wajib Pajak",
  taxPayerName: "Nama Wajib Pajak",
  taxStatus: "Status Pajak",
  update: "Status Update",
  updatedAt: "Tanggal Update",
  uuid_bgn: "UUID Bangunan",
};
</script>
