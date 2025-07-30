export enum BuildingSurveyStatus {
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

export enum BuildingSurveyOwnerType {
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

// JENIS_BGN
export enum BuildingType {
  RESIDENTIAL = "RESIDENTIAL", // Perumahan
  PRIVATE_OFFICE = "PRIVATE_OFFICE", // Perkantoran Swasta
  FACTORY = "FACTORY", // Pabrik
  STORE_APOTHECARY_MARKET_RUKO = "STORE_APOTHECARY_MARKET_RUKO", // Toko/Apotek/Pasar/Ruko
  HOSPITAL_CLINIC = "HOSPITAL_CLINIC", // Rumah Sakit/Klinik
  SPORTS_RECREATION = "SPORTS_RECREATION", // Olahraga/Rekreasi
  HOTEL = "HOTEL", // Hotel/Wisma
  WORKSHOP_WAREHOUSE_FARM = "WORKSHOP_WAREHOUSE_FARM", // Bengkel/Gudang/Pertanian
  GOVERNMENT_BUILDING = "GOVERNMENT_BUILDING", // Gedung Pemerintah
  SCHOOL = "SCHOOL", // Gedung Sekolah
  OTHER = "OTHER", // Lain-lain
}

export enum BuildingConstruction {
  STEEL = "STEEL", // Baja
  CONCRETE = "CONCRETE", // Beton
  BRICK = "BRICK", // Batu Bata
  WOOD = "WOOD", // Kayu
}

export enum BuildingWall {
  GLASS_ALUMINUM = "GLASS_ALUMINUM", // Kaca/Alumunium
  CONCRETE = "CONCRETE", // Beton
  CONBLOC_BRICK = "CONBLOC_BRICK", // Batu Bata Conbloc
  WOOD = "WOOD", // Kayu
  CORRUGATED_METAL = "CORRUGATED_METAL", // Seng
}

export enum BuildingFloorType {
  MARBLE = "MARBLE", // Marmer
  CERAMIC = "CERAMIC", // Keramik
  TERRAZZO = "TERRAZZO", // Teraso
  CONCRETE_TILE = "CONCRETE_TILE", // Ubin PC/Papan
  CEMENT = "CEMENT", // Semen
}

export enum BuildingUpdate {
  ACCURATE = "ACCURATE", // Sudah Tepat
  NEW = "NEW", // Baru
  NON_PERMANENT = "NON_PERMANENT", // Bukan Bangunan Permanen
}

export enum RoofType {
  GENTENG = "Genteng",
  GALVALUM = "Galvalum",
  ASBES = "Asbes",
  SENG = "Seng",
}

export enum ShowBuildingFilter {
  SHOW_ALL = "Show All",
  SHOW_ONLY_NEW_BUILDING = "Show Only New Building",
  SHOW_ONLY_OLD_BUILDING = "Show Only Old Building",
}
