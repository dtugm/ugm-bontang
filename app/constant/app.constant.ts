export default {
  menus: [
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
      sub_menu: [
        {
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Bumi",
          path: "/survey-monitoring",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Bangunan",
          path: "/building-monitoring",
        },
      ],
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
      sub_menu: [
        {
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Bumi",
          path: "/survey-monitoring",
        },
        {
          prepend_icon: "mdi-office-building",
          title: "Bangunan",
          path: "/building-monitoring",
        },
      ],
    },
    {
      prepend_icon: "mdi-database-edit",
      title: "Progress",
      sub_menu: [
        {
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Suvey PBB",
          path: "/production-survey-pbb",
        },
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/production-peta-garis",
        },
        {
          prepend_icon: "mdi-cube-outline",
          title: "3D Models",
          path: "/production-3d-models",
        },
      ],
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
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Suvey PBB",
          path: "/production-survey-pbb",
        },
        {
          prepend_icon: "mdi-map",
          title: "Peta Garis",
          path: "/production-peta-garis",
        },
        {
          prepend_icon: "mdi-cube-outline",
          title: "3D Models",
          path: "/production-3d-models",
        },
      ],
    },
  ],

  location: {
    longitude: 0.12505772302512846,
    latitude: 117.48004699561473,
  },
};
