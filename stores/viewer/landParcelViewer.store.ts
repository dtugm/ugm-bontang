import vectorsApi from "~/app/api/vectors.api";
import model3DApi from "~/app/api/view/model3D.api";

export const useViewerLandParcelStore = defineStore("viewerLandParcel", () => {
  const isBuildingActive = ref(true);
  const isLandParcelActive = ref(true);
  const basemapLayer = ref("osm");
  const isOrthoPhotoActive = ref(false);

  const activeBuilding: any = ref([]);
  const getActiveBuilding = async () => {
    await model3DApi
      .get_3d_tiles({
        category: "building",
        status: true,
        clamp: "MEAN_SEA_LEVEL",
      })
      .then((resp) => {
        activeBuilding.value = resp;
      });
  };

  const activeLandParcel: any = ref([]);
  const getActiveLandParcel = async () => {
    const resp = await vectorsApi.get_all_vectors({
      category: "land_parcel",
      pageSize: Number(30),
      isActive: true,
    });
    activeLandParcel.value = resp.data;
  };
  return {
    isBuildingActive,
    isLandParcelActive,

    activeBuilding,
    getActiveBuilding,

    activeLandParcel,
    getActiveLandParcel,

    basemapLayer,
    isOrthoPhotoActive,
  };
});
