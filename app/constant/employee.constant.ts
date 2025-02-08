export default {
  petaGarisHeader: [
    { title: "ID", value: "id", align: "center" },
    { title: "GRID", value: "GRID", align: "center" },
    { title: "Status", value: "status", align: "center" },
    { title: "Date Created", minWidth: "150px", value: "date_created" },
    { title: "Date Submitted", minWidth: "150px", value: "date_submitted" },
    { title: "Action", value: "action", width: "200px", align: "center" },
  ],
  boTaskHeader: [
    { title: "ID", value: "id", align: "center" },
    {
      title: "OLD GRID",
      value: "old_grid",
      sortable: true,
      orderBy: "old_grid",
    },
    {
      title: "NEW GRID",
      value: "new_grid",
      sortable: true,
      orderBy: "new_grid",
    },
    { title: "Status", value: "status", align: "center" },
    { title: "Files", value: "file_kerja" },
    { title: "Date Submitted", minWidth: "150px", value: "date_submitted" },
    { title: "Action", value: "action", width: "200px", align: "center" },
  ],
  logBookHeader: [
    { title: "Tanggal", value: "tanggal", minWidth: "200" },
    { title: "Kegiatan", value: "kegiatan", minWidth: "200" },
    {
      title: "Capaian Kerja",
      align: "center",

      children: [
        { title: "PG (ha)", value: "capaian_pg", minWidth: "200" },
        { title: "SU (Blok Tanah)", value: "capaian_su", minWidth: "200" },
        { title: "MDL (ha)", value: "capaian_mdl", minWidth: "200" },
      ],
    },
    { title: "Jam Kerja", value: "jam_kerja", minWidth: "200" },
    { title: "Jam Lembur", value: "jam_lembur", minWidth: "200" },
    { title: "Keterangan", value: "keterangan", minminWidth: "200" },
    { title: "Actions", value: "action", minminWidth: "200" },
  ],
};
