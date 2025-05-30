export default {
  stakeholderMenus: [
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
      path: "/3d-viewer",
    },
    {
      prepend_icon: "mdi-cube",
      title: "3d Viewer V2",
      path: "/viewer",
    },
  ],
};
