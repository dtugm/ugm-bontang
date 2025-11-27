export default {
  table_vectors: {
    headers: [
      { title: "No", key: "no", sortable: false },
      { title: "Name", key: "name", sortable: false },
      { title: "Type", key: "type", sortable: false },

      { title: "Category", key: "category", sortable: false },
      {
        title: "File Name",
        key: "filename",
        sortable: false,
        minWidth: "300",
      },
      { title: "Status", key: "isActive", sortable: false },
      { title: "Status Action", key: "status_action", sortable: false },
      { title: "Actions", key: "action", sortable: false, minWidth: "100" },
    ],
  },
};
