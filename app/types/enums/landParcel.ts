export enum LotSurveyStatus {
  ACCURATE = "ACCURATE",
  NEW_DATA = "NEW_DATA",
  TAX_OBJECT_MERGE = "TAX_OBJECT_MERGE",
  TAX_OBJECT_SPLIT = "TAX_OBJECT_SPLIT",
  DELINEATION = "DELINEATION",
  CONFLICT = "CONFLICT",
  OWNER_CANNOT_BE_MEET = "OWNER_CANNOT_BE_MEET",
  NOT_YET_SURVEYED = "NOT_YET_SURVEYED",
  OTHER = "OTHER",
}

export enum LotSurveyOwnerType {
  PUBLIC_FACILITY = "PUBLIC_FACILITY",
  GOVERNMENT_AREA = "GOVERNMENT_AREA",
  NON_GOVERNMENT_AREA = "NON_GOVERNMENT_AREA",
  OTHER = "OTHER",
  UNKNOWN = "UNKNOWN",
}

// Kode WP
export enum TaxPayerCode {
  NO_CHANGES = "NO_CHANGES", // Tidak ada perubahan
  TAX_PAYER_CHANGED = "TAX_PAYER_CHANGED", // Wajib pajak berubah
  TAX_PAYER_CHANGED_GOVERNMENT_LAND = "TAX_PAYER_CHANGED_GOVERNMENT_LAND", // Wajib pajak berubah (tanah pemerintah)
  TAX_PAYER_CHANGED_PUBLIC_FACILITY = "TAX_PAYER_CHANGED_PUBLIC_FACILITY", // Wajib pajak berubah (fasilitas umum)
  NO_INFORMATION = "NO_INFORMATION", // Tidak ada kejelasan
  NEW = "NEW",
}

// Kode OP
export enum TaxObjectCode_1 {
  ACCURATE = "ACCURATE", // Tepat
  CHANGED = "CHANGED", // Terdapat perubahan
  NULL = "NULL",
}

// Kode OP2
export enum TaxObjectCode_2 {
  NEW_TAX_OBJECT = "NEW_TAX_OBJECT", // Objek Pajak Baru
  MERGING_TAX_OBJECT = "MERGING_TAX_OBJECT", // Penggabungan Objek Pajak
  SPLITTING_TAX_OBJECT = "SPLITTING_TAX_OBJECT", // Pemecahan Objek Pajak
  REDELINIATION = "REDELINIATION", // Redelineasasi (Batas Berubah)
  CONFLICT = "CONFLICT", // Sengketa
}

// Kode WWC
export enum WWCCode {
  TAX_SUBJECT_MET = "TAX_SUBJECT_MET", // WP terdaftar
  TAX_SUBJECT_NOT_MET = "TAX_SUBJECT_NOT_MET", // WP tidak terdaftar
  TAX_SUBJECT_REPRESENTATIVE = "TAX_SUBJECT_REPRESENTATIVE", // WP DIWAKILKAN PENDAMPING
  NULL = "NULL",
}

export enum LandType {
  LAND_AND_BUILDING = "LAND_AND_BUILDING", // Tanah & Bangunan
  READY_TO_BUILD_PLOT = "READY_TO_BUILD_PLOT", // Kavling Siap Bangun
  EMPTY_LAND = "EMPTY_LAND", // Tanah Kosong
  PUBLIC_FACILITY = "PUBLIC_FACILITY", // Fasilitas Umum
  GOVERNMENT_LAND = "GOVERNMENT_LAND", // Tanah Pemerintah
}

export enum STAWPOP {
  MENEMPATI = "Menempati di Objek Pajak",
  MENYEWAKAN = "Menyewakan Objek Pajak",
  SEBAGAI_PEMILIK = "Sebagai Pemilik (Tidak Menempati)",
  TIDAK_JELAS = "Tidak Jelas",
}
