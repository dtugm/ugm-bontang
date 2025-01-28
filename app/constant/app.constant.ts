export default {
  menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
    },
    {
      prepend_icon: "mdi-monitor-multiple",
      title: "Monitoring",
      sub_menu: [
        {
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Suvey PBB",
          path: "/survey-monitoring",
        },
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
    // {
    //   prepend_icon: "mdi-account-multiple",
    //   title: "Employee Management",
    //   path: "/employee-management",
    // },
  ],
  employee_menus: [
    {
      prepend_icon: "mdi-monitor-dashboard",
      title: "Dashboard",
      path: "/",
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
      title: "Monitoring",
      sub_menu: [
        {
          prepend_icon: "mdi-receipt-text-edit-outline",
          title: "Suvey PBB",
          path: "/survey-monitoring",
        },
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
      prepend_icon: "mdi-account-multiple",
      title: "Employee Management",
      path: "/employee-management",
    },
  ],
};
