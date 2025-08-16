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
        <v-btn @click="testBulk"> Test Submit</v-btn>
        <v-btn @click="submitBulkBatch"> Bulk Chunk</v-btn>
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
        fid: data.UUID,
        polygonId: data.ID,
        regionCode: data.KODEWILAYA,
        rightNumber: data.NOMOR_HAK,
        typeOfRight: data.TIPEHAK,
        nib: data.NIB,
        nibel: data.NIBEL,
        taxObjectNumber: data.NOP,
        newTaxObjectNumber: data.NOP_BARU,
        citizenId: data.NIK_WP || "NIK_WP kosong",
        taxPayerName: data.NAMA_WP,
        pemilikSebelumnya: data.PEMILIK_PE,
        pemilikAktual: data.PEMILIK_AK,
        kerjaWp: data.KERJA_WP,
        kerjaWp2: data.KERJA_WP2,
        taxPayerAddress: data.ALAMAT_WP,
        taxPayerPhone: data.NOMOR_HP1,
        phoneNumber1: data.NOMOR_HP1,
        phoneNumber2: data.NOMOR_HP2,
        taxObjectAddress: data.ALAMAT_OP,
        rt: data.RT,
        village: data.KELURAHAN,
        district: data.KECAMATAN,
        province: "Kalimantan Timur",
        city: "Bontang",
        ketSrtf: data.KET_SRTF,
        staWpop: staWpopMap[data.STA_WPOP],
        landType: jenisTanahMap[data.JENIS_TNH],
        l_tertul: Number(data.LUASTERTUL).toFixed(2),
        area: Number(data.LUASPETA).toFixed(2),
        l_bumi: Number(data.L_BUMI).toFixed(2),
        buildingTotal: Number(data.JML_BGN),
        twoWheelVehicleTotal: Number(data.JML_KDR2),
        fourWheelVehicleTotal: Number(data.JML_KDR4),
        wwcCode: wwcMap[data.KODE_WWC],
        taxPayerCode: wpMap[data.KODE_WP],
        taxObjectCode_1: op1Map[data.KODE_OP1],
        taxObjectCode_2: op2Map[data.KODE_OP2],
        ...(data.FOTO_WWC && {
          imageUrls: [
            `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${data.FOTO_WWC}`,
          ],
        }),
        year: Number(data.TAHUN),
        alatUkur: data.ALATUKUR,
        landUsage: data.PENGGUNAAN,
        metodeUkur: data.METODUKUR,
        suratUkur: data.Surat_Ukur,
        produk: data.Produk,
        longitude: data.LONG_TNH,
        latitude: data.LAT_TNH,
        taxStatus: "",
        rw: "",
        productType: data.TIPEPRODUK,
        uuid: data.UUID,
        newUuid: data.UUID_BARU,
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
};
const submitBulkBatch = async () => {
  const chunkSize = 100; // proses 10 data sekaligus
  const chunks = [];

  for (let i = 0; i < items.value.length; i += chunkSize) {
    chunks.push(items.value.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map(async (data) => {
        const dataPayload = {
          fid: data.UUID,
          polygonId: data.ID,
          regionCode: data.KODEWILAYA,
          rightNumber: data.NOMOR_HAK,
          typeOfRight: data.TIPEHAK,
          nib: data.NIB,
          nibel: data.NIBEL,
          taxObjectNumber: data.NOP,
          newTaxObjectNumber: data.NOP_BARU,
          citizenId: data.NIK_WP || "NIK_WP kosong",
          taxPayerName: data.NAMA_WP,
          pemilikSebelumnya: data.PEMILIK_PE,
          pemilikAktual: data.PEMILIK_AK,
          kerjaWp: data.KERJA_WP,
          kerjaWp2: data.KERJA_WP2,
          taxPayerAddress: data.ALAMAT_WP,
          taxPayerPhone: data.NOMOR_HP1,
          phoneNumber1: data.NOMOR_HP1,
          phoneNumber2: data.NOMOR_HP2,
          taxObjectAddress: data.ALAMAT_OP,
          rt: data.RT,
          village: "Bontang Baru",
          district: data.KECAMATAN,
          province: "Kalimantan Timur",
          city: "Bontang",
          ketSrtf: data.KET_SRTF,
          staWpop: staWpopMap[data.STA_WPOP],
          landType: jenisTanahMap[data.JENIS_TNH],
          l_tertul: Number(data.LUASTERTUL).toFixed(2),
          area: Number(data.LUASPETA).toFixed(2),
          l_bumi: Number(data.L_BUMI).toFixed(2),
          buildingTotal: Number(data.JML_BGN),
          twoWheelVehicleTotal: Number(data.JML_KDR2),
          fourWheelVehicleTotal: Number(data.JML_KDR4),
          wwcCode: wwcMap[data.KODE_WWC],
          taxPayerCode: wpMap[data.KODE_WP],
          taxObjectCode_1: op1Map[data.KODE_OP1],
          taxObjectCode_2: op2Map[data.KODE_OP2],
          ...((data.FOTO_WWC || data.F_WWC) && {
            imageUrls: [
              `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${
                data.FOTO_WWC || data.F_WWC
              }`,
            ],
          }),
          year: Number(data.TAHUN),
          alatUkur: data.ALATUKUR,
          landUsage: data.PENGGUNAAN,
          metodeUkur: data.METODUKUR,
          suratUkur: data.Surat_Ukur,
          produk: data.Produk,
          longitude: data.LONG_TNH,
          latitude: data.LAT_TNH,
          taxStatus: "",
          rw: "",
          productType: data.TIPEPRODUK,
          uuid: data.UUID,
          newUuid: data.UUID_BARU,
        };

        try {
          await lotSurveyApi.post_lot_survey_monitorings({
            data: dataPayload,
            images: null,
          });
        } catch (error) {
          try {
            const resp: any = await lotSurveyApi.get_persil_by_fid(data.UUID);
            await lotSurveyApi.EditMonitoring(
              { data: dataPayload, images: null },
              resp.id
            );
          } catch (err2) {
            console.error(`Gagal proses UUID: ${data.UUID}`, err2);
          }
        }
      })
    );

    console.log("Batch selesai:", results);
  }

  console.log("Semua batch selesai 🚀");
};

const testBulk = async () => {
  const data = items.value[7];
  // const resp: any = await lotSurveyApi.getLotSurveyData({ search: data.NOP });
  const dataPayload = {
    fid: data.UUID,
    polygonId: data.ID,
    regionCode: data.KODEWILAYA,
    rightNumber: data.NOMOR_HAK,
    typeOfRight: data.TIPEHAK,
    nib: data.NIB,
    nibel: data.NIBEL,
    taxObjectNumber: data.NOP,
    newTaxObjectNumber: data.NOP_BARU,
    citizenId: data.NIK_WP || "NIK_WP kosong",
    taxPayerName: data.NAMA_WP,
    pemilikSebelumnya: data.PEMILIK_PE,
    pemilikAktual: data.PEMILIK_AK,
    kerjaWp: data.KERJA_WP,
    kerjaWp2: data.KERJA_WP2,
    taxPayerAddress: data.ALAMAT_WP,
    taxPayerPhone: data.NOMOR_HP1,
    phoneNumber1: data.NOMOR_HP1,
    phoneNumber2: data.NOMOR_HP2,
    taxObjectAddress: data.ALAMAT_OP,
    rt: data.RT,
    village: "Bontang Baru",
    district: data.KECAMATAN,
    province: "Kalimantan Timur",
    city: "Bontang",
    ketSrtf: data.KET_SRTF,
    staWpop: staWpopMap[data.STA_WPOP],
    landType: jenisTanahMap[data.JENIS_TNH],
    l_tertul: Number(data.LUASTERTUL).toFixed(2),
    area: Number(data.LUASPETA).toFixed(2),
    l_bumi: Number(data.L_BUMI).toFixed(2),
    buildingTotal: Number(data.JML_BGN),
    twoWheelVehicleTotal: Number(data.JML_KDR2),
    fourWheelVehicleTotal: Number(data.JML_KDR4),
    wwcCode: wwcMap[data.KODE_WWC],
    taxPayerCode: wpMap[data.KODE_WP],
    taxObjectCode_1: op1Map[data.KODE_OP1],
    taxObjectCode_2: op2Map[data.KODE_OP2],
    ...((data.FOTO_WWC || data.F_WWC) && {
      imageUrls: [
        `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${
          data.FOTO_WWC || data.F_WWC
        }`,
      ],
    }),
    year: Number(data.TAHUN),
    alatUkur: data.ALATUKUR,
    landUsage: data.PENGGUNAAN,
    metodeUkur: data.METODUKUR,
    suratUkur: data.Surat_Ukur,
    produk: data.Produk,
    longitude: data.LONG_TNH,
    latitude: data.LAT_TNH,
    taxStatus: "",
    rw: "",
    productType: data.TIPEPRODUK,
    uuid: data.UUID,
    newUuid: data.UUID_BARU,
  };
  console.log(dataPayload);
  // try {
  //   await lotSurveyMonitoringsApi.create_lot_survey_monitoring({
  //     data: dataPayload,
  //   });
  // } catch (error) {
  //   await lotSurveyApi.get_persil_by_fid(data.UUID).then(async (resp: any) => {
  //     console.log(resp.id);
  //     await lotSurveyApi.EditMonitoring(
  //       {
  //         data: dataPayload,
  //         images: null,
  //       },
  //       resp.id
  //     );
  //   });
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
