export default {
  BindagTanahHeader: [
    { title: "FID", value: "fid" },
    { title: "ID", value: "ID" },
    { title: "Tipe Pemilik", value: "ownerType" },
    { title: "Status", value: "status", sortable: true },
    { title: "Actions", value: "action" },
  ],
  statusMap: {
    ACCURATE: "Sudah Tepat",
    NEW_DATA: "Data Baru",
    TAX_OBJECT_MERGE: "Penggabungan Object Pajak",
    TAX_OBJECT_SPLIT: "Pemecahan Object Pajak",
    DELINEATION: "Delineasi",
    CONFLICT: "Sengketa",
    OWNER_CANNOT_BE_MEET: "Pemilik Tidak Bisa Ditemui",
    NOT_YET_SURVEYED: "Belum Disurvey",
    OTHER: "Sudah Tepat",
  },
  statusMapAngka: {
    1: "ACCURATE",
    2: "NEW_DATA",
    3: "TAX_OBJECT_MERGE",
    4: "TAX_OBJECT_SPLIT",
    5: "DELINEATION",
    6: "CONFLICT",
    7: "OWNER_CANNOT_BE_MEET",
    8: "NOT_YET_SURVEYED",
    9: "OTHER",
  },
  statusMapAngkaColor: {
    1: "#008000",
    2: "#FFD700",
    3: "#FFA500",
    4: "#FF8C00",
    5: "#FF4500",
    6: "#B22222",
    7: "#FF8C00",
    8: "#FF4500",
    9: "#008000",
  },
  statusColorMap: {
    ACCURATE: "#008000",
    NEW_DATA: "#FFD700",
    TAX_OBJECT_MERGE: "#FFA500",
    TAX_OBJECT_SPLIT: "#FF8C00",
    DELINEATION: "#FF4500",
    CONFLICT: "#B22222",
    OWNER_CANNOT_BE_MEET: "#FF8C00",
    NOT_YET_SURVEYED: "#FF4500",
    OTHER: "#008000",
  },

  statusFeatureOptions: [
    { title: "Sudah Tepat", value: "ACCURATE" },
    { title: "Data Baru", value: "NEW_DATA" },
    { title: "Penggabungan Object Pajak", value: "TAX_OBJECT_MERGE" },
    { title: "Pemecahan Object Pajak", value: "TAX_OBJECT_SPLIT" },
    { title: "Delineasi", value: "DELINEATION" },
    { title: "Sengketa", value: "CONFLICT" },
    { title: "Pemilik Tidak Bisa Ditemui", value: "OWNER_CANNOT_BE_MEET" },
    { title: "Belum Disurvey", value: "NOT_YET_SURVEYED" },
    { title: "Lainnya...", value: "OTHER" },
  ],
  ownerTypeMap: {
    PUBLIC_FACILITY: "Fasilitas Umum",
    GOVERNMENT_AREA: "Government Area",
    NON_GOVERNMENT_AREA: "Non Government Area",
  },
  ownerTypeOptions: [
    { title: "Fasilitas Umum", value: "PUBLIC_FACILITY" },
    { title: "Government Area", value: "GOVERNMENT_AREA" },
    { title: "Non Government Area", value: "NON_GOVERNMENT_AREA" },
  ],

  JENIS_TNH: {
    1: "#4CAF50", // Tanah & Bangunan - hijau
    2: "#2196F3", // Kavling Siap Bangun - biru
    3: "#FFC107", // Tanah Kosong - kuning
    4: "#9C27B0", // Fasilitas Umum - ungu
    5: "#F44336", // Tanah Pemerintah - merah
  },
  JENIS_BGN: {
    1: "#4caf50", // Perumahan - Hijau
    2: "#2196f3", // Perkantoran Swasta - Biru
    3: "#f44336", // Pabrik - Merah
    4: "#ff9800", // Toko/Apotek/Pasar/Ruko - Oranye
    5: "#9c27b0", // Rumah Sakit/Klinik - Ungu
    6: "#00bcd4", // Olahraga/Rekreasi - Cyan
    7: "#ffeb3b", // Hotel/Wisma - Kuning
    8: "#795548", // Bengkel/Gudang/Pertanian - Coklat
    9: "#3f51b5", // Gedung Pemerintah - Biru tua
    10: "#8bc34a", // Gedung Sekolah - Hijau muda
    11: "#9e9e9e", // Lain-lain - Abu-abu
  },
  kecamatans: ["Bontang Utara", "Bontang Barat","Bontang Selatan"],
  kelurahans: [
    "Api api", "Bontang Baru", "Lok Tuan","Bontang Kuala","Guntung", "Gunung Elai",
    "Belimbing", "Gunung Telihan", "Kanaan",
    "Tanjung Laut", "Tanjung Laut Indah", "Berbas Pantai", "Berbas Tengah", "Bontang Lestari", "Satimpo",
  ],
  tipeHaks: ["Hak Milik", "Hak Guna Bangunan", "Hak Pakai", "Hak Wakaf", "Kosong"],
  searchOptions: [
    { text: "Nama WP", value: "NAMA_WP" },
    { text: "Pemakaian", value: "PENGGUNAAN" },
    { text: "RT", value: "RT" },
    { text: "Alamat OP", value: "ALAMAT_OP" },
    { text: "Jumlah Bangunan", value: "JML_BGN" },
    { text: "STA WPOP", value: "STA_WPOP" },
    { text: "NIB", value: "NIB" },
  ],
  columnName: {
    "NAMA_WP": "namaWP",
    "PENGGUNAAN": "penggunaan",
    "RT": "rt",
    "ALAMAT_OP": "alamatOP",
    "JML_BGN": "jmlBgn",
    "STA_WPOP": "staWPOP",
    "NIB": "nib",
  }
};
