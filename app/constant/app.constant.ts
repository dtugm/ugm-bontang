export default {
  stakeHolder_menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
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
    {
      prepend_icon: "mdi-earth",
      title: "Survey PBB",
      path: "/survey-monitoring",
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Model Viewer",
      path: "/optimized",
    },
    // {
    //   prepend_icon: "mdi-cube",
    //   title: "3d Viewer V2",
    //   path: "/viewer",
    // },
  ],
  leader_studio_menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "3D Tiles",
      path: "/3dTiles",
    },
    {
      prepend_icon: "mdi-monitor-multiple",
      title: "Studio",
      sub_menu: [
        {
          prepend_icon: "mdi-access-point",
          title: "Lidar",
          path: "/studio/studio_lidar",
        },
        {
          prepend_icon: "mdi-cube",
          title: "3d Models",
          path: "/studio/studio_3d",
        },
      ],
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Model Viewer",
      path: "/optimized",
    },
    // {
    //   prepend_icon: "mdi-cube",
    //   title: "3d Viewer V2",
    //   path: "/viewer",
    // },
  ],
  member_lidar_users: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-access-point",
      title: "Lidar",
      path: "/studio/studio_lidar",
    },
    {
      prepend_icon: "mdi-earth",
      title: "Progress",
      sub_menu: [
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/production-peta-garis",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Building Outline",
          path: "/production-bo",
        },
      ],
    },
  ],
  member_3d_users: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Model",
      path: "/studio/studio_3d",
    },
    {
      prepend_icon: "mdi-earth",
      title: "Progress",
      sub_menu: [
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/production-peta-garis",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Building Outline",
          path: "/production-bo",
        },
      ],
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Model Viewer",
      path: "/optimized",
    },
  ],

  pj_menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-monitor-multiple",
      title: "Studio Lidar",
      path: "/studio/studio_lidar",
    },
    {
      prepend_icon: "mdi-book-clock",
      title: "LogBook Survey",
      path: "/survey/logbook",
    },
    {
      prepend_icon: "mdi-monitor-multiple",
      title: "Monitoring Studio",
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
    {
      prepend_icon: "mdi-earth",
      title: "Survey PBB",
      path: "/survey-monitoring",
    },
    {
      prepend_icon: "mdi-database-edit",
      title: "Progress",
      sub_menu: [
        {
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Bidang Tanah",
          path: "/production-survey-pbb",
        },
      ],
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Model Viewer",
      path: "/optimized",
    },
  ],
  employee_menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-earth",
      title: "Progress",
      sub_menu: [
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/production-peta-garis",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Building Outline",
          path: "/production-bo",
        },
      ],
    },
  ],
  superadmin_menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Groups",
      path: "/groups",
    },
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "3D Tiles",
      path: "/3dTiles",
    },
    {
      prepend_icon: "mdi-earth",
      title: "Survey PBB",
      path: "/survey-monitoring",
    },
    {
      prepend_icon: "mdi-receipt-text-edit-outline",
      title: "Bidang Tanah",
      path: "/production-survey-pbb",
    },
    {
      prepend_icon: "mdi-receipt-text-edit-outline",
      title: "Data Survey",
      path: "/survey-monitoring/data",
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Model Viewer",
      path: "/optimized",
    },
  ],

  location: {
    longitude: 0.12505772302512846,
    latitude: 117.48004699561473,
  },
};
