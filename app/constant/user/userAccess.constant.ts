export const groupAccessMap: Record<string, string[]> = {
  "Pelatihan Bontang 2025": [
    "/", // 3D Viewer
    "/cesium",
    "/land_parcel_cesium",

    "/data/land_parcel",
    "/data/building",
  ],
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
    "/solar-panels",
    "/rdtr",
  ],
  stakeholder: [
    "/",
    "/cesium",
    "/land_parcel_cesium",
    "/3d-model-monitoring",
    "/peta-garis-monitoring",
    "/survey-monitoring",
    // Data Survey
    "/data/land_parcel",
    "/data/building",
    "/solar-panels",
    "/rdtr",
  ],

  "Supervisor Bontang": [
    "/",
    // File Management
    "/admin/model_3d_management",
    "/admin/vector_2d_management",
    "/data/land_parcel",
    "/data/building",
    "/survey-monitoring",
    "/solar-panels",
    // 3D Viewer
    "/cesium",
    "/land_parcel_cesium",
  ],
  "Bapenda Bontang": [
    "/", // 3D Viewer
    "/cesium",
    "/land_parcel_cesium",
  ],
  "BPN Bontang": [
    "/",

    // 3D Viewer
    "/cesium",
    "/land_parcel_cesium",
  ],
};
