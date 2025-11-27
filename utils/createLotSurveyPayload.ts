import {
  staWpopMap,
  jenisTanahMap,
  wwcMap,
  wpMap,
  op1Map,
  op2Map,
} from "~/app/constant/mapping/inputLandParcel";

export function createLotSurveyPayload(data: any) {
  return {
    fid: data.UUID ?? null,
    polygonId: data.ID ?? null,
    regionCode: data.KODEWILAYA ?? "",
    rightNumber: data.NOMOR_HAK ?? "",
    typeOfRight: data.TIPEHAK ?? "",
    nib: data.NIB ?? "",
    nibel: data.NIBEL ?? "",
    taxObjectNumber: data.NOP ?? "",
    newTaxObjectNumber: data.NOP_BARU ?? "",
    citizenId: data.NIK_WP || "NIK_WP kosong",
    taxPayerName: data.NAMA_WP ?? "",
    pemilikSebelumnya: data.PEMILIK_PE ?? "",
    pemilikAktual: data.PEMILIK_AK ?? "",
    kerjaWp: data.KERJA_WP ?? "",
    kerjaWp2: data.KERJA_WP2 ?? "",
    taxPayerAddress: data.ALAMAT_WP ?? "",
    taxPayerPhone: data.NOMOR_HP1 ?? "",
    phoneNumber1: data.NOMOR_HP1 ?? "",
    phoneNumber2: data.NOMOR_HP2 ?? "",
    taxObjectAddress: data.ALAMAT_OP ?? "",
    rt: data.RT ?? "",
    village: data.KELURAHAN || "Bontang Baru",
    district: data.KECAMATAN ?? "",
    province: "Kalimantan Timur",
    city: "Bontang",
    ketSrtf: data.KET_SRTF ?? "",

    // 🟢 Mapping FIXED: kalau key nggak ada → null
    staWpop: staWpopMap[data.STA_WPOP] ?? null,
    landType: jenisTanahMap[data.JENIS_TNH] ?? null,

    // 🟢 Number FIXED: kalau kosong → 0
    l_tertul: Number(data.LUASTERTUL || 0).toFixed(2),
    area: Number(data.LUASPETA || 0).toFixed(2),
    l_bumi: Number(data.L_BUMI || 0).toFixed(2),
    buildingTotal: Number(data.JML_BGN || 0),
    twoWheelVehicleTotal: Number(data.JML_KDR2 || 0),
    fourWheelVehicleTotal: Number(data.JML_KDR4 || 0),

    // 🟢 Mapping FIXED
    wwcCode: wwcMap[data.KODE_WWC] ?? null,
    taxPayerCode: wpMap[data.KODE_WP] ?? null,
    taxObjectCode_1: op1Map[data.KODE_OP1] ?? null,
    taxObjectCode_2: op2Map[data.KODE_OP2] ?? null,

    // 🟢 Image (conditionally added)
    ...((data.FOTO_WWC || data.F_WWC) && {
      imageUrls: [
        `https://dt-ugm-api.s3.ap-southeast-2.amazonaws.com/7e1c700f-d8bf-4cfd-8bfd-862bac01f9f3/photo-collection-survey-monitoring/${
          data.FOTO_WWC || data.F_WWC
        }`,
      ],
    }),

    year: Number(data.TAHUN || 0),
    alatUkur: data.ALATUKUR ?? "",
    landUsage: data.PENGGUNAAN ?? "",
    metodeUkur: data.METODUKUR ?? "",
    suratUkur: data.Surat_Ukur ?? "",
    produk: data.Produk ?? "",
    longitude: data.LONG_TNH ?? null,
    latitude: data.LAT_TNH ?? null,
    taxStatus: "",
    rw: "",
    productType: data.TIPEPRODUK ?? "",
    uuid: data.UUID ?? null,
    newUuid: data.UUID_BARU ?? null,
  };
}
