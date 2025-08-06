export const groupAccessMap: Record<string, string[]> = {
  SuperAdmin: [
    "/",
    // User
    "/groups",
    "/admin/user_management",
    //
    "/3dTiles",
    "/peta-garis-monitoring",

    // Studio
    "/3d-model-monitoring",
    "/survey-monitoring",

    // 3D Viewer
    "/cesium",
    "/land_parcel_cesium",

    // Data Survey
    "/data/land_parcel",
    "/data/building",

    // File Management
    "/admin/model_3d_management",
    "/admin/vector_2d_management",
  ],
  stakeholder: [
    "/",
    "/cesium",
    "/land_parcel_cesium",
    "/3d-model-monitoring",
    "/peta-garis-monitoring",
  ],

  "Supervisor Bontang": ["/"],
  "Bapenda Bontang": ["/"],
  "BPN Bontang": ["/"],
};
