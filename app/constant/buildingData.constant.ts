export default {
  table_data: {
    headers: [
      { title: "No", key: "no" },
      {
        title: "UUID Bangunan",
        key: "fid",
        sortable: false,
        minWidth: "370px",
      },
      { title: "Kelurahan", key: "village", sortable: false },
      { title: "Alamat", key: "address", sortable: false, minWidth: "150px" },
      { title: "Tipe Lantai", key: "buildingFloorType", sortable: false },
      { title: "Tipe Bangunan", key: "buildingType", sortable: false },
      { title: "Tipe Dinding", key: "buildingWall", sortable: false },
      { title: "Tipe Atap", key: "roofType", sortable: false },
      { title: "Status", key: "update", sortable: false },
      // { title: "Actions", key: "action", sortable: false },
    ],
  },
  table_collection: {
    headers: [
      { title: "No", key: "no", sortable: false },
      //   { title: "UUID", key: "fid" },
      //   { title: "UUID_BGN", key: "uuid_bgn" },
      { title: "Province", key: "province", sortable: false },
      { title: "City", key: "city", sortable: false },
      { title: "Kecamatan", key: "district", sortable: false },
      { title: "Kelurahan", key: "village", sortable: false },
      { title: "Alamat", key: "address", sortable: false },
      { title: "Jumlah Lantai", key: "floorCount", sortable: false },
      { title: "NOP", key: "taxObjectNumber", sortable: false },
      { title: "NOP BARU", key: "newTaxObjectNumber", sortable: false },
      { title: "Status", key: "buildingUpdate", sortable: false },
    ],
  },
};
