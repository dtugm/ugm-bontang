export default {
  table_vectors: {
    headers: [
      { title: "No", key: "no" },
      { title: "Name", key: "name" },
      { title: "Type", key: "type" },
      { title: "Category", key: "category" },
      { title: "Status", key: "isActive" },
      { title: "Created At", key: "updatedAt" },
      { title: "Updated At", key: "createdAt" },
      { title: "Actions", key: "action" },
    ],
  },

  table_data: {
    headers: [
      { title: "No", key: "no" },
      { title: "Province", key: "province" },
      { title: "City", key: "city" },
      { title: "Kecamatan", key: "district" },
      { title: "Kelurahan", key: "village" },
      { title: "Status", key: "status" },
      { title: "NOP", key: "taxObjectNumber" },
      { title: "NOP BARU", key: "newTaxObjectNumber" },
      { title: "Update", key: "buildingUpdate" },
      { title: "Actions", key: "action" },
    ],
  },
  land_parcel_table: {
    headers: [
      { title: "No", key: "no", sortable: false },
      { title: "NIB", key: "nib", sortable: false },
      {
        title: "Nama Pemilik",
        key: "taxPayerName",
        sortable: false,
        minWidth: "200px",
      },
      { title: "Jenis Hak", key: "typeOfRight", sortable: false },
      { title: "Luas Persil", key: "l_bumi", sortable: false },
      {
        title: "Alamat Objek Pajak",
        key: "taxObjectAddress",
        sortable: false,
        minWidth: "200px",
      },
      { title: "STAWPOP", key: "staWpop", sortable: false, minWidth: "200px" },
      { title: "Kelurahan", key: "village", sortable: false },
      { title: "Image", key: "image", sortable: false, minWidth: "120px" },
      // { title: "Nomor Objek Pajak", key: "taxObjectNumber", sortable: false },
      // { title: "UUID Persil", key: "fid", sortable: false },
      { title: "Actions", key: "action", sortable: false, minWidth: "120px" },
    ],
  },

  table_collection: {
    headers: [
      { title: "No", key: "no" },
      //   { title: "UUID", key: "fid" },
      //   { title: "UUID_BGN", key: "uuid_bgn" },
      { title: "Province", key: "province" },
      { title: "City", key: "city" },
      { title: "Kecamatan", key: "district" },
      { title: "Kelurahan", key: "village", minWidth: "150px" },
      { title: "Status", key: "status" },
      {
        title: "Alamat Object Pajak",
        key: "taxObjectAddress",
        minWidth: "200px",
      },

      { title: "NIB", key: "nib" },
      { title: "Total Bangunan", key: "buildingTotal" },
      { title: "NOP", key: "taxObjectNumber" },
      { title: "NOP BARU", key: "newTaxObjectNumber" },
    ],
  },
  target: {
    bangunan: {
      boba: 4949,
      apiapi: 5496,
      loktuan: 5192,
    },
    bidang: {
      boba: 3121,
      apiapi: 5219,
      loktuan: 4959,
    },
  },
  actual: {
    bangunan: {
      boba: 4949,
      apiapi: 5626,
      loktuan: 3128,
    },
    bidang: {
      boba: 3246,
      apiapi: 5290,
      loktuan: 4952,
    },
  },
};
