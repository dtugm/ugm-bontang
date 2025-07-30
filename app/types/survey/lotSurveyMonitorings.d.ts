declare interface IGetSummaryLotByAdministrative
  extends Record<string, string> {
  administrativeLevel: "province" | "city" | "district" | "village";
}
declare interface IGetLotSurveyByFid extends Record<string, string> {
  fid: string;
}

declare interface ICreateLotSurveyMonitoringPayload {
  images?: File | File[];
  data: IDataCreateLotSurvetMonitoringType;
}
declare interface ILotSurveyMonitoringItems
  extends IDataCreateLotSurvetMonitoringType {
  id: String;
}

declare interface IDataCreateLotSurvetMonitoringType {
  polygonId: string | number; // data.ID
  fid: string; // data.UUID
  province: string; // "Kalimantan Timur"
  city: string; // "Bontang"
  district: string; // data.KECAMATAN
  village: string; // data.KELURAHAN
  taxObjectAddress: string; // data.ALAMAT_OP
  taxPayerName: string; // data.NAMA_WP
  imageUrls: string[]; // array URL gambar
  taxObjectNumber: string; // data.NOP
  citizenId: string; // data.NIK_WP || "NIK_WP kosong"
  taxPayerAddress: string; // data.ALAMAT_WP
  taxPayerPhone?: string; // data.NOMOR_HP1 (juga ada phoneNumber1/2 di bawah)
  buildingTotal: number; // Number(data.JML_BGN)
  taxPayerCode?: string; // wpMap[data.KODE_WP]
  taxObjectCode_1?: string; // op1Map[data.KODE_OP1]
  taxObjectCode_2?: string; // op2Map[data.KODE_OP2]
  wwcCode?: string; // wwcMap[data.KODE_WWC]
  taxStatus: string; // ""
  rt?: string | number; // data.RT
  rw?: string | number; // ""
  regionCode?: string; // data.KODEWILAYA
  typeOfRight?: string; // data.TIPEHAK
  productType?: string; // data.TIPEPRODUK
  year: number; // Number(data.TAHUN)
  nib?: string; // data.NIB
  area: number; // Number(data.LUASPETA)
  landUsage?: string; // data.PENGGUNAAN
  nibel?: string; // data.NIBEL
  ketSrtf?: string; // data.KET_SRTF
  twoWheelVehicleTotal: number; // Number(data.JML_KDR2)
  fourWheelVehicleTotal: number; // Number(data.JML_KDR4)
  landType?: string; // jenisTanahMap[data.JENIS_TNH]
  uuid: string; // data.UUID
  newUuid?: string; // data.UUID_BARU
  newTaxObjectNumber?: string; // data.NOP_BARU
  phoneNumber1?: string; // data.NOMOR_HP1
  phoneNumber2?: string; // data.NOMOR_HP2
  rightNumber?: string; // data.NOMOR_HAK
  l_bumi?: number | string; // data.L_BUMI
  l_tertul?: number | string; // data.LUASTERTUL
  staWpop?: string; // staWpopMap[data.STA_WPOP]
  kerjaWp?: string; // data.KERJA_WP
  kerjaWp2?: string; // data.KERJA_WP2
  pemilikSebelumnya?: string; // data.PEMILIK_PE
  pemilikAktual?: string; // data.PEMILIK_AK
  alatUkur?: string; // data.ALATUKUR
  metodeUkur?: string; // data.METODUKUR
  suratUkur?: string; // data.Surat_Ukur
  produk?: string; // data.Produk
}
