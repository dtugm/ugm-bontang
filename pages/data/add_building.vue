<template>
  <v-container>
    <!-- <SuperadminVectors /> -->
    <v-row>
      <v-col cols="12" md="6">
        <v-file-input
          label="Upload CSV File"
          accept=".csv"
          :multiple="false"
          @update:model-value="onFileChange"
          prepend-icon="mdi-file-upload"
        />
        <!-- <AppInputText v-model="rt"></AppInputText> -->
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="submitBulk">Submit</v-btn>
        <v-btn @click="submitTest">Submit</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="items.length">
      <v-col cols="12">
        <AppTableBasic :headers="headers" :items="items" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const rt = ref();
import Papa from "papaparse";
import {
  BuildingConstruction,
  BuildingFloorType,
  BuildingType,
  BuildingUpdate,
  BuildingWall,
  RoofType,
} from "~/app/types/enums/building";
import buildingSurveyMonitoringsApi from "~/app/api/survey/buildingSurveyMonitorings.api";
const headers = ref<{ title: string; key: string }[]>([]);
const items = ref<any[]>([]);
const jenisBgnMap: Record<string, BuildingType> = {
  "1": BuildingType.RESIDENTIAL,
  "2": BuildingType.PRIVATE_OFFICE,
  "3": BuildingType.FACTORY,
  "4": BuildingType.STORE_APOTHECARY_MARKET_RUKO,
  "5": BuildingType.HOSPITAL_CLINIC,
  "6": BuildingType.SPORTS_RECREATION,
  "7": BuildingType.HOTEL,
  "8": BuildingType.WORKSHOP_WAREHOUSE_FARM,
  "9": BuildingType.GOVERNMENT_BUILDING,
  "10": BuildingType.SCHOOL,
  "11": BuildingType.OTHER,
};
const konstruksiMap: Record<string, BuildingConstruction> = {
  "1": BuildingConstruction.STEEL,
  "2": BuildingConstruction.CONCRETE,
  "3": BuildingConstruction.BRICK,
  "4": BuildingConstruction.WOOD,
};
const wallMap: Record<string, BuildingWall> = {
  "1": BuildingWall.GLASS_ALUMINUM,
  "2": BuildingWall.CONCRETE,
  "3": BuildingWall.CONBLOC_BRICK,
  "4": BuildingWall.WOOD,
  "5": BuildingWall.CORRUGATED_METAL,
};
const floorMap: Record<string, BuildingFloorType> = {
  "1": BuildingFloorType.MARBLE,
  "2": BuildingFloorType.CERAMIC,
  "3": BuildingFloorType.TERRAZZO,
  "4": BuildingFloorType.CONCRETE_TILE,
  "5": BuildingFloorType.CEMENT,
};
const roofMap: Record<string, RoofType> = {
  "1": RoofType.GENTENG,
  "2": RoofType.GALVALUM,
  "3": RoofType.ASBES,
  "4": RoofType.SENG,
};
const buildlingUpdateMap: Record<string, BuildingUpdate> = {
  "1": BuildingUpdate.ACCURATE,
  "2": BuildingUpdate.NEW,
  "3": BuildingUpdate.NON_PERMANENT,
};
const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
const submitBulk = async () => {
  const chunkedItems = chunkArray(items.value, 100);

  for (const batch of chunkedItems) {
    const results = await Promise.all(
      batch.map(async (data) => {
        const dataPayload = {
          fid: data.UUID,
          toponimi: data.TOPONIMI || null,
          taxObjectNumber: data.NOP || null,
          newTaxObjectNumber: data.NOP_BARU || null,
          address: data.ALAMAT_BGN || null,
          buildingType: jenisBgnMap[data.JENIS_BGN] || null,
          floorCount: data.JML_LANTAI ? Number(data.JML_LANTAI) : null,
          airConditionerCount: data.JUMLAH_AC ? Number(data.JUMLAH_AC) : null,
          buildingConstruction: konstruksiMap[data.KONSTRUKSI] || null,
          buildingWall: wallMap[data.DINDING] || null,
          buildingFloorType: floorMap[data.JENIS_LT] || null,
          update: buildlingUpdateMap[data.UPDATE],
          ...((data.F_BGN || data.FOTO_BGN) && {
            imageUrls: [
              `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${
                data.F_BGN || data.FOTO_BGN
              }`,
            ],
          }),
          electricity: data.LISTRIK ? Number(data.LISTRIK) : null,
          luasBgnLama: data.L_BGN_OLD ? Number(data.L_BGN_OLD) : null,
          luasBgn: data.LUAS_BGN ? Number(data.LUAS_BGN) : null,
          luasBgnBaru: data.L_HITUNG ? Number(data.L_HITUNG) : null,
          rt: data.RT,
          province: "Kalimantan Timur",
          city: "Bontang",
          district: data.KECAMATAN,
          village: data.KELURAHAN,
          uuid_bgn: data.UUID || null,
          roofType: roofMap[data.JENIS_ATAP] || null,
          dateUpdt: data.DATE_UPDT || null,
          nopBgn: data.NOP_BGN || null,
          longBgn: data.LONG_BGN ? parseFloat(data.LONG_BGN) : null,
          latBgn: data.LAT_BGN ? parseFloat(data.LAT_BGN) : null,
          nopBgb: data.NOP_BGN,
          taxPayerName: data.NAMA_WP,
        };

        try {
          await buildingSurveyMonitoringsApi.create_building_survey_monitoring({
            data: dataPayload,
          });
        } catch (error) {
          await buildingSurveyMonitoringsApi
            .get_building_survey_by_fid({ fid: data.UUID })
            .then(async (resp: any) => {
              await buildingSurveyMonitoringsApi.update_building_survey_monitoring(
                { id: resp.id },
                {
                  data: dataPayload,
                  images: null,
                }
              );
            });
        }
      })
    );

    console.log(`Batch ${chunkedItems.indexOf(batch) + 1} processed.`);
  }
};
const submitTest = async () => {
  const data = items.value[1];
  console.log(data);
  const dataPayload = {
    fid: data.UUID,
    toponimi: data.TOPONIMI || null,
    taxObjectNumber: data.NOP || null,
    newTaxObjectNumber: data.NOP_BARU || null,
    address: data.ALAMAT_BGN || null,
    buildingType: jenisBgnMap[data.JENIS_BGN] || null,
    floorCount: data.JML_LANTAI ? Number(data.JML_LANTAI) : null,
    airConditionerCount: data.JUMLAH_AC ? Number(data.JUMLAH_AC) : null,
    buildingConstruction: konstruksiMap[data.KONSTRUKSI] || null,
    buildingWall: wallMap[data.DINDING] || null,
    buildingFloorType: floorMap[data.JENIS_LT] || null,
    update: buildlingUpdateMap[data.UPDATE],
    ...((data.F_BGN || data.FOTO_BGN) && {
      imageUrls: [
        `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${
          data.F_BGN || data.FOTO_BGN
        }`,
      ],
    }),
    electricity: data.LISTRIK ? Number(data.LISTRIK) : null,
    luasBgnLama: data.L_BGN_OLD ? Number(data.L_BGN_OLD) : null,
    luasBgn: data.LUAS_BGN ? Number(data.LUAS_BGN) : null,
    luasBgnBaru: data.L_HITUNG ? Number(data.L_HITUNG) : null,
    rt: data.RT,
    province: "Kalimantan Timur",
    city: "Bontang",
    district: data.KECAMATAN,
    village: data.KELURAHAN,
    uuid_bgn: data.UUID || null,
    roofType: roofMap[data.JENIS_ATAP] || null,
    dateUpdt: data.DATE_UPDT || null,
    nopBgn: data.NOP_BGN || null,
    longBgn: data.LONG_BGN ? parseFloat(data.LONG_BGN) : null,
    latBgn: data.LAT_BGN ? parseFloat(data.LAT_BGN) : null,
    taxPayerName: data.NAMA_WP,
  };
  console.log(dataPayload);
  // try {
  //   await buildingSurveyMonitoringsApi.create_building_survey_monitoring({
  //     data: dataPayload,
  //   });
  // } catch (error) {
  //   await buildingSurveyMonitoringsApi
  //     .get_building_survey_by_fid({ fid: data.UUID })
  //     .then(async (resp: any) => {
  //       await buildingSurveyMonitoringsApi.update_building_survey_monitoring(
  //         { id: resp.id },
  //         {
  //           data: dataPayload,
  //           images: null,
  //         }
  //       );
  //     });
  // }
};

function onFileChange(file: File | File[] | undefined) {
  if (!file) return;

  // Kalau file berbentuk array, ambil file pertama
  const selectedFile = Array.isArray(file) ? file[0] : file;

  Papa.parse(selectedFile, {
    header: true,
    skipEmptyLines: true,
    complete(result: any) {
      const data = result.data as any[];
      if (data.length > 0) {
        headers.value = Object.keys(data[0]).map((key) => ({
          title: key,
          key: key,
        }));
        items.value = data;
      }
    },
    error(error: any) {
      console.error("CSV parse error:", error);
    },
  });
}
</script>
