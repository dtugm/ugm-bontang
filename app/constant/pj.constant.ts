export default {
  evaluasiHeader: [
    { title: "ID", value: "id", align: "center" },
    {
      title: "GRID",
      value: "GRID",
      align: "center",
      sortable: true,
      orderBy: "GRID",
    },
    { title: "Status", value: "status", align: "center" },
    { title: "Date Submitted", minWidth: "150px", value: "date_submitted" },
    { title: "Files", value: "file" },
    { title: "Action", value: "action", width: "200px", align: "center" },
  ],
  evaluasiBoHeader: [
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
    { title: "Date Submitted", minWidth: "150px", value: "date_submitted" },
    { title: "Done Date", minWidth: "150px", value: "done_date" },
    { title: "Files", value: "file" },
    { title: "Action", value: "action", width: "200px", align: "center" },
  ],
  employeeStatusHeader: [
    { title: "Nama", value: "user_name", width: "200px" },
    {
      title: "Status Kehadiran",
      value: "statusKerja",
      width: "200px",
    },
    {
      title: "Keterangan",
      value: "keterangan",
      width: "200px",
    },
    {
      title: "Masuk",
      value: "check_in_time",
      width: "200px",
    },
    {
      title: "Keluar",
      value: "check_out_time",
      width: "200px",
    },
    {
      title: "Actions",
      value: "action",
      width: "200px",
    },
  ],

  employeeBoTaskHeader: [
    { title: "ID", value: "id", align: "center" },
    { title: "Area", value: "area", align: "center" },
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
    { title: "Date created", minWidth: "150px", value: "date_created" },
    { title: "Files", value: "file_kerja" },
  ],
};
