import {
  BuildingFloorType,
  BuildingUpdate,
  BuildingType,
  BuildingWall,
  TaxPayerCode,
  TaxObjectCode_1,
  TaxObjectCode_2,
  BuildingConstruction,
  RoofType,
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
export const floorColorMap: Record<BuildingFloorType, string> = {
  [BuildingFloorType.MARBLE]: "#1565C0", // biru tua
  [BuildingFloorType.CERAMIC]: "#EF6C00", // oranye gelap
  [BuildingFloorType.TERRAZZO]: "#6A1B9A", // ungu tua
  [BuildingFloorType.CONCRETE_TILE]: "#C62828", // merah tua
  [BuildingFloorType.CEMENT]: "#2E7D32", // hijau tua
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

export const buildingTypeColorMap: Record<BuildingType, string> = {
  [BuildingType.RESIDENTIAL]: "#1565C0", // Biru tua
  [BuildingType.PRIVATE_OFFICE]: "#00897B", // Hijau kebiruan
  [BuildingType.FACTORY]: "#EF6C00", // Oranye gelap
  [BuildingType.STORE_APOTHECARY_MARKET_RUKO]: "#6A1B9A", // Ungu tua
  [BuildingType.HOSPITAL_CLINIC]: "#C62828", // Merah tua
  [BuildingType.SPORTS_RECREATION]: "#2E7D32", // Hijau tua
  [BuildingType.HOTEL]: "#AD1457", // Pink tua
  [BuildingType.WORKSHOP_WAREHOUSE_FARM]: "#4E342E", // Cokelat tua
  [BuildingType.GOVERNMENT_BUILDING]: "#283593", // Biru indigo gelap
  [BuildingType.SCHOOL]: "#0277BD", // Biru cerah tapi tetap tegas
  [BuildingType.OTHER]: "#616161", // Abu-abu gelap
};

export const buildingUpdateMap: Record<BuildingUpdate, string> = {
  [BuildingUpdate.ACCURATE]: "Sudah Tepat",
  [BuildingUpdate.NEW]: "Bangunan Baru",
  [BuildingUpdate.NON_PERMANENT]: "Bukan Bangunan Permanen",
};
export const buildingUpdateColorMap: Record<BuildingUpdate, string> = {
  [BuildingUpdate.ACCURATE]: "success",
  [BuildingUpdate.NEW]: "warning",
  [BuildingUpdate.NON_PERMANENT]: "error",
};

export const wallTypeMap: Record<BuildingWall, string> = {
  [BuildingWall.CONBLOC_BRICK]: "Batu Bata Conbloc",
  [BuildingWall.CONCRETE]: "Beton",
  [BuildingWall.CORRUGATED_METAL]: "Seng",
  [BuildingWall.GLASS_ALUMINUM]: "Kaca/Alumunium",
  [BuildingWall.WOOD]: "Kayu",
};

export const wallTypeColorMap: Record<BuildingWall, string> = {
  [BuildingWall.CONBLOC_BRICK]: "#D84315", // Merah bata tua
  [BuildingWall.CONCRETE]: "#546E7A", // Abu-abu kebiruan gelap
  [BuildingWall.CORRUGATED_METAL]: "#0277BD", // Biru baja
  [BuildingWall.GLASS_ALUMINUM]: "#00838F", // Biru kehijauan metalik
  [BuildingWall.WOOD]: "#6D4C41", // Cokelat kayu gelap
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

export const roofTypeColorMap: Record<RoofType, string> = {
  [RoofType.GENTENG]: "#B71C1C", // Merah genteng tua
  [RoofType.GALVALUM]: "#546E7A", // Abu kebiruan metal
  [RoofType.ASBES]: "#6D4C41", // Cokelat abu-abu tua
  [RoofType.SENG]: "#0277BD", // Biru baja
};

export const buildingTypeIconMap: Record<BuildingType, string> = {
  [BuildingType.RESIDENTIAL]: "mdi-home-city", // Perumahan
  [BuildingType.PRIVATE_OFFICE]: "mdi-office-building", // Perkantoran
  [BuildingType.FACTORY]: "mdi-factory", // Pabrik
  [BuildingType.STORE_APOTHECARY_MARKET_RUKO]: "mdi-storefront", // Toko / Ruko
  [BuildingType.HOSPITAL_CLINIC]: "mdi-hospital-building", // Rumah sakit
  [BuildingType.SPORTS_RECREATION]: "mdi-basketball-hoop", // Olahraga / Rekreasi
  [BuildingType.HOTEL]: "mdi-bed", // Hotel / Wisma
  [BuildingType.WORKSHOP_WAREHOUSE_FARM]: "mdi-warehouse", // Gudang / Pertanian
  [BuildingType.GOVERNMENT_BUILDING]: "mdi-town-hall", // Gedung pemerintah
  [BuildingType.SCHOOL]: "mdi-school", // Sekolah
  [BuildingType.OTHER]: "mdi-help-circle", // Lain-lain
};
