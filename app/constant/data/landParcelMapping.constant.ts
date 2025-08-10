import {
  LandType,
  STAWPOP,
  TaxObjectCode_1,
  TaxObjectCode_2,
  TaxPayerCode,
  WWCCode,
} from "~/app/types/enums/landParcel";

export const taxPayerCodeMap: Record<TaxPayerCode, string> = {
  [TaxPayerCode.NO_CHANGES]: "Tidak ada perubahan",
  [TaxPayerCode.TAX_PAYER_CHANGED]: "Wajib pajak berubah",
  [TaxPayerCode.TAX_PAYER_CHANGED_GOVERNMENT_LAND]:
    "Wajib pajak berubah (tanah pemerintah)",
  [TaxPayerCode.TAX_PAYER_CHANGED_PUBLIC_FACILITY]:
    "Wajib pajak berubah (fasilitas umum)",
  [TaxPayerCode.NO_INFORMATION]: "Tidak ada kejelasan",
  [TaxPayerCode.NEW]: "Baru",
};

export const taxObjectCode1Map: Record<TaxObjectCode_1, string> = {
  [TaxObjectCode_1.ACCURATE]: "Tepat",
  [TaxObjectCode_1.CHANGED]: "Terdapat perubahan",
  [TaxObjectCode_1.NULL]: "-",
};

export const taxObjectCode2Map: Record<TaxObjectCode_2, string> = {
  [TaxObjectCode_2.NEW_TAX_OBJECT]: "Objek Pajak Baru",
  [TaxObjectCode_2.MERGING_TAX_OBJECT]: "Penggabungan Objek Pajak",
  [TaxObjectCode_2.SPLITTING_TAX_OBJECT]: "Pemecahan Objek Pajak",
  [TaxObjectCode_2.REDELINIATION]: "Redelineasasi (Batas Berubah)",
  [TaxObjectCode_2.CONFLICT]: "Sengketa",
};

export const wwcCodeMap: Record<WWCCode, string> = {
  [WWCCode.TAX_SUBJECT_MET]: "WP terdaftar",
  [WWCCode.TAX_SUBJECT_NOT_MET]: "WP tidak terdaftar",
  [WWCCode.TAX_SUBJECT_REPRESENTATIVE]: "WP diwakilkan pendamping",
  [WWCCode.NULL]: "-",
};

export const landTypeMap: Record<LandType, string> = {
  [LandType.LAND_AND_BUILDING]: "Tanah & Bangunan",
  [LandType.READY_TO_BUILD_PLOT]: "Kavling Siap Bangun",
  [LandType.EMPTY_LAND]: "Tanah Kosong",
  [LandType.PUBLIC_FACILITY]: "Fasilitas Umum",
  [LandType.GOVERNMENT_LAND]: "Tanah Pemerintah",
};

export const stawpopMap: Record<STAWPOP, string> = {
  [STAWPOP.MENEMPATI]: "Menempati di Objek Pajak",
  [STAWPOP.MENYEWAKAN]: "Menyewakan Objek Pajak",
  [STAWPOP.SEBAGAI_PEMILIK]: "Sebagai Pemilik (Tidak Menempati)",
  [STAWPOP.TIDAK_JELAS]: "Tidak Jelas",
};
