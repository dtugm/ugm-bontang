export default {
  All_Menus: [
    // Dashboard
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-map",
      title: "2D Land parcel",
      path: "/survey-monitoring",
    },
    {
      prepend_icon: "mdi-land-plots",
      title: "Simulasi RDTR",
      path: "/rdtr",
    },
    {
      prepend_icon: "mdi-solar-panel",
      title: "Solar Panels Potential",
      path: "/solar-panels",
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
      title: "Data Tabular",
      sub_menu: [
        {
          prepend_icon: "mdi-map",
          title: "Persil Tanah",
          path: "/data/land_parcel",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Bangunan",
          path: "/data/building",
        },
      ],
    },
    {
      prepend_icon: "mdi-database-cog",
      title: "Data Spasial",
      sub_menu: [
        {
          prepend_icon: "mdi-cube",
          title: "Data 3D",
          path: "/admin/model_3d_management",
        },
        {
          prepend_icon: "mdi-vector-polyline",
          title: "Data Vector",
          path: "/admin/vector_2d_management",
        },
      ],
    },
    // Monitoring Studio
    {
      prepend_icon: "mdi-monitor-multiple",
      title: "Studio Progress",
      sub_menu: [
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/peta-garis-monitoring",
        },
        {
          prepend_icon: "mdi-cube-outline",
          title: "Model 3D",
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
          title: "Persil Tanah 3D",
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
