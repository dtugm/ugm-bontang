export default {
  All_Menus: [
    // Dashboard
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    // User Management
    {
      prepend_icon: "mdi-table-account",
      title: "Accounts",
      sub_menu: [
        {
          prepend_icon: "mdi-account",
          title: "Users",
          path: "/admin/user_management",
        },
        {
          prepend_icon: "mdi-account-group",
          title: "Groups",
          path: "/groups",
        },
      ],
    },
    // Data Management
    {
      prepend_icon: "mdi-database-cog",
      title: "Data Management",
      sub_menu: [
        {
          prepend_icon: "mdi-cube",
          title: "3D Tiles",
          path: "/admin/model_3d_management",
        },
        {
          prepend_icon: "mdi-vector-polyline",
          title: "2D Vector",
          path: "/admin/vector_2d_management",
        },
        {
          prepend_icon: "mdi-map",
          title: "Land Parcel",
          path: "/data/land_parcel",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Building",
          path: "/data/building",
        },
      ],
    },
    // Monitoring Studio
    {
      prepend_icon: "mdi-monitor-multiple",
      title: "Studio",
      sub_menu: [
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/peta-garis-monitoring",
        },
        {
          prepend_icon: "mdi-cube-outline",
          title: "3D Model",
          path: "/3d-model-monitoring",
        },
      ],
    },
    // 3D Viewer
    {
      prepend_icon: "mdi-earth",
      title: "Viewer 3D",
      sub_menu: [
        {
          prepend_icon: "mdi-cube",
          title: "Digital Twin",
          path: "/cesium",
        },
        {
          prepend_icon: "mdi-map",
          title: "Land Parcel",
          path: "/land_parcel_cesium",
        },
      ],
    },

    // Collection
    {
      prepend_icon: "mdi-database",
      title: "Database Survey",
      sub_menu: [
        {
          prepend_icon: "mdi-land-plots-marker",
          title: "Bidang Tanah",
          path: "/collection/lot_survey",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Bangunan",
          path: "/collection/building",
        },
      ],
    },
  ],
};
