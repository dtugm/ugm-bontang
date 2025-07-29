<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-file-input
          label="Upload CSV File"
          accept=".csv"
          :multiple="false"
          @update:model-value="onFileChange"
          prepend-icon="mdi-file-upload"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="submitBulk">Submit</v-btn>
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
import Papa from "papaparse";
import lotSurveyApi from "~/app/api/lotSurvey.api";
import {
  LandType,
  STAWPOP,
  TaxObjectCode_1,
  TaxObjectCode_2,
  WWCCode,
  TaxPayerCode,
} from "~/app/types/enums/landParcel";
const headers = ref<{ title: string; key: string }[]>([]);
const items = ref<any[]>([]);
const staWpopMap: Record<string, STAWPOP> = {
  "1": STAWPOP.MENEMPATI,
  "2": STAWPOP.MENYEWAKAN,
  "3": STAWPOP.SEBAGAI_PEMILIK,
  "4": STAWPOP.TIDAK_JELAS,
};
const jenisTanahMap: Record<string, LandType> = {
  "1": LandType.LAND_AND_BUILDING,
  "2": LandType.READY_TO_BUILD_PLOT,
  "3": LandType.EMPTY_LAND,
  "4": LandType.PUBLIC_FACILITY,
  "5": LandType.GOVERNMENT_LAND,
};
const wwcMap: Record<string, WWCCode> = {
  "1": WWCCode.TAX_SUBJECT_MET,
  "2": WWCCode.TAX_SUBJECT_NOT_MET,
  "3": WWCCode.TAX_SUBJECT_REPRESENTATIVE,
};
const wpMap: Record<string, TaxPayerCode> = {
  "1": TaxPayerCode.NO_CHANGES,
  "2": TaxPayerCode.TAX_PAYER_CHANGED,
  "3": TaxPayerCode.TAX_PAYER_CHANGED_GOVERNMENT_LAND,
  "4": TaxPayerCode.TAX_PAYER_CHANGED_PUBLIC_FACILITY,
  "5": TaxPayerCode.NEW,
  "6": TaxPayerCode.NO_INFORMATION,
};
const op1Map: Record<string, TaxObjectCode_1> = {
  "1": TaxObjectCode_1.ACCURATE,
  "2": TaxObjectCode_1.CHANGED,
};
const op2Map: Record<string, TaxObjectCode_2> = {
  "1": TaxObjectCode_2.NEW_TAX_OBJECT,
  "2": TaxObjectCode_2.MERGING_TAX_OBJECT,
  "3": TaxObjectCode_2.SPLITTING_TAX_OBJECT,
  "4": TaxObjectCode_2.REDELINIATION,
  "5": TaxObjectCode_2.CONFLICT,
};
const submitBulk = async () => {
  const results = await Promise.all(
    items.value.map(async (data) => {
      const dataPayload = {
        polygonId: data.ID,
        fid: data.UUID,
        province: "Kalimantan Timur",
        city: "Bontang",
        district: data.KECAMATAN,
        village: data.KELURAHAN,
        taxObjectAddress: data.ALAMAT_OP,
        taxPayerName: data.NAMA_WP,
        imageUrls: [
          `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${data.FOTO_WWC}`,
        ],
        taxObjectNumber: data.NOP,
        citizenId: data.NIK_WP || "NIK_WP kosong",
        taxPayerAddress: data.ALAMAT_WP,
        taxPayerPhone: data.NOMOR_HP1,
        buildingTotal: Number(data.JML_BGN),
        taxPayerCode: wpMap[data.KODE_WP],
        taxObjectCode_1: op1Map[data.KODE_OP1],
        taxObjectCode_2: op2Map[data.KODE_OP2],
        wwcCode: wwcMap[data.KODE_WWC],
        taxStatus: "",
        rt: data.RT,
        rw: "",
        regionCode: data.KODEWILAYA,
        typeOfRight: data.TIPEHAK,
        productType: data.TIPEPRODUK,
        year: Number(data.TAHUN),
        nib: data.NIB,
        area: Number(data.LUASPETA),
        landUsage: data.PENGGUNAAN,
        nibel: data.NIBEL,
        ketSrtf: data.KET_SRTF,
        twoWheelVehicleTotal: Number(data.JML_KDR2),
        fourWheelVehicleTotal: Number(data.JML_KDR4),
        landType: jenisTanahMap[data.JENIS_TNH],
        uuid: data.UUID,
        newUuid: data.UUID_BARU,
        newTaxObjectNumber: data.NOP_BARU,
        phoneNumber1: data.NOMOR_HP1,
        phoneNumber2: data.NOMOR_HP2,
        rightNumber: data.NOMOR_HAK,
        l_bumi: data.L_BUMI,
        l_tertul: data.LUASTERTUL,
        staWpop: staWpopMap[data.STA_WPOP],
        kerjaWp: data.KERJA_WP,
        kerjaWp2: data.KERJA_WP2,
        pemilikSebelumnya: data.PEMILIK_PE,
        pemilikAktual: data.PEMILIK_AK,
        alatUkur: data.ALATUKUR,
        metodeUkur: data.METODUKUR,
        suratUkur: data.Surat_Ukur,
        produk: data.Produk,
      };

      try {
        await lotSurveyApi.post_lot_survey_monitorings({
          data: dataPayload,
          images: null,
        });
      } catch (error) {
        await lotSurveyApi
          .get_persil_by_fid(data.UUID)
          .then(async (resp: any) => {
            console.log(resp.id);
            await lotSurveyApi.EditMonitoring(
              {
                data: dataPayload,
                images: null,
              },
              resp.id
            );
          });
      }
    })
  );
  const data = items.value[7];
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
