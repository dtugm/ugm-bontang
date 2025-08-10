import {
  BuildingFloorType,
  BuildingUpdate,
  BuildingType,
  BuildingWall,
  TaxPayerCode,
  TaxObjectCode_1,
  TaxObjectCode_2,
  BuildingConstruction,
} from "~/app/types/enums/building";

export const buildingConstructionMap: Record<BuildingConstruction, string> = {
  [BuildingConstruction.STEEL]: "Baja",
  [BuildingConstruction.CONCRETE]: "Beton",
  [BuildingConstruction.BRICK]: "Batu Bata",
  [BuildingConstruction.WOOD]: "Kayu",
};
export const floorTypeMap: Record<BuildingFloorType, string> = {
  [BuildingFloorType.MARBLE]: "Marmer",
  [BuildingFloorType.CERAMIC]: "Keramik",
  [BuildingFloorType.TERRAZZO]: "Teraso",
  [BuildingFloorType.CONCRETE_TILE]: "Ubin PC/Papan",
  [BuildingFloorType.CEMENT]: "Semen",
};

export const buildingTypeMap: Record<BuildingType, string> = {
  [BuildingType.RESIDENTIAL]: "Perumahan",
  [BuildingType.PRIVATE_OFFICE]: "Perkantoran Swasta",
  [BuildingType.FACTORY]: "Pabrik",
  [BuildingType.STORE_APOTHECARY_MARKET_RUKO]: "Toko / Apotek / Pasar / Ruko",
  [BuildingType.HOSPITAL_CLINIC]: "Rumah Sakit / Klinik",
  [BuildingType.SPORTS_RECREATION]: "Olahraga / Rekreasi",
  [BuildingType.HOTEL]: "Hotel / Wisma",
  [BuildingType.WORKSHOP_WAREHOUSE_FARM]: "Bengkel / Gudang / Pertanian",
  [BuildingType.GOVERNMENT_BUILDING]: "Gedung Pemerintah",
  [BuildingType.SCHOOL]: "Gedung Sekolah",
  [BuildingType.OTHER]: "Lain-lain",
};

export const buildingUpdateMap: Record<BuildingUpdate, string> = {
  [BuildingUpdate.ACCURATE]: "Sudah Tepat",
  [BuildingUpdate.NEW]: "Bangunan Baru",
  [BuildingUpdate.NON_PERMANENT]: "Bukan Bangunan Permanen",
};

export const wallTypeMap: Record<BuildingWall, string> = {
  [BuildingWall.CONBLOC_BRICK]: "Batu Bata Conbloc",
  [BuildingWall.CONCRETE]: "Beton",
  [BuildingWall.CORRUGATED_METAL]: "Seng",
  [BuildingWall.GLASS_ALUMINUM]: "Kaca/Alumunium",
  [BuildingWall.WOOD]: "Kayu",
};

export const TaxpayerCodeMap: Record<TaxPayerCode, string> = {
  [TaxPayerCode.NO_CHANGES]: " Tidak ada perubahan",
  [TaxPayerCode.TAX_PAYER_CHANGED]: "Wajib pajak berubah",
  [TaxPayerCode.TAX_PAYER_CHANGED_GOVERNMENT_LAND]:
    "Wajib pajak berubah (tanah pemerintah)",
  [TaxPayerCode.TAX_PAYER_CHANGED_PUBLIC_FACILITY]:
    "Wajib pajak berubah (fasilitas umum)",
  [TaxPayerCode.NO_INFORMATION]: "Tidak ada kejelasan",
};

export const taxObjectCode1Map: Record<TaxObjectCode_1, string> = {
  [TaxObjectCode_1.ACCURATE]: "Tepat",
  [TaxObjectCode_1.CHANGED]: "Terdapat Perubahan",
  [TaxObjectCode_1.NULL]: "-",
};

export const taxObjectCode2Map: Record<TaxObjectCode_2, string> = {
  [TaxObjectCode_2.NEW_TAX_OBJECT]: "Objek Pajak Baru",
  [TaxObjectCode_2.MERGING_TAX_OBJECT]: "Penggabungan Objek Pajak",
  [TaxObjectCode_2.SPLITTING_TAX_OBJECT]: "Pemecahan Objek Pajak",
  [TaxObjectCode_2.REDELINIATION]: "Redelineasasi (Batas Berubah)",
  [TaxObjectCode_2.CONFLICT]: "Sengketa",
};
