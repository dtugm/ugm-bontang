import buildingSurveyMonitoringsApi from "~/app/api/survey/buildingSurveyMonitorings.api";
import tiles3DApi from "~/app/api/tiles3D.api";
import model3DApi from "~/app/api/view/model3D.api";
import { apiWrapper } from "~/app/helper/api.helper";

export const use3dTilesStore = defineStore("3dTiles", () => {
  const isFetchingData = ref(false);
  const tiles3dItems: any = ref([]);
  const getAll3dTiles = async () => {
    isFetchingData.value = true;
    const resp = await tiles3DApi.get_all_3d_tiles();
    tiles3dItems.value = resp;
    isFetchingData.value = false;
    return resp;
  };
  const upload3dTiles = async (payload: IUpload3dTilesPayload) => {
    await apiWrapper(() => tiles3DApi.upload_3d_tiles(payload), {
      successMessage: "Berhasil mengunggah data!",
    });
  };
  const delete3dTiles = async (id: string) => {
    await apiWrapper(() => tiles3DApi.delete_3d_tiles(id), {
      successMessage: "Berhasil menghapus data!",
    });
  };
  const update3dTiles = async (
    path: IPathId,
    payload: ICreate3DModelPayload
  ) => {
    await apiWrapper(() => model3DApi.edit_3d_tiles(path, payload), {
      successMessage: "Berhasil mengubah data!",
      errorMessage: "Gagal mengubah data.",
    });
  };

  const popUpBuildingBuilding = ref(false);
  const buildingAttribute = ref({});
  const attrLoading = ref(false);
  const getDetailBuilding = async (uuidBgn: string) => {
    attrLoading.value = true;
    popUpBuildingBuilding.value = true;
    try {
      const resp =
        await buildingSurveyMonitoringsApi.get_building_survey_by_uuid({
          uuidBgn: uuidBgn,
        });
      buildingAttribute.value = resp;
    } catch (error) {
      buildingAttribute.value = {};
    }
    attrLoading.value = false;
  };
  const activeBuilding: any = ref([]);
  const getActiveBuilding = async () => {
    await model3DApi
      .get_3d_tiles({
        category: "building",
        status: true,
        clamp: "DTM_BONTANG",
        texture: false,
      })
      .then((resp) => {
        activeBuilding.value = resp;
      });
  };
  const activeBuildingCesium: any = ref([]);
  const getActiveBuildingCesium = async () => {
    await model3DApi
      .get_3d_tiles({
        category: "building",
        status: true,
        clamp: "DTM_BONTANG",
        texture: true,
        source: "CESIUM",
      })
      .then((resp) => {
        activeBuildingCesium.value = resp;
      });
  };
  const getActiveBuildingFlat = async () => {
    await model3DApi
      .get_3d_tiles({
        category: "building",
        status: true,
        clamp: "MEAN_SEA_LEVEL",
        texture: false,
      })
      .then((resp) => {
        activeBuilding.value = resp;
      });
  };

  const activeRoad: any = ref([]);
  const getActiveRoad = async () => {
    await model3DApi
      .get_3d_tiles({
        category: "road",
        status: true,
      })
      .then((resp) => {
        activeRoad.value = resp;
      });
  };

  const isBuildingActive = ref(true);
  const isTexturedBuildingActive = ref(true);
  const isRoadActive = ref(true);
  const layer = ref("osm");
  const buildingVariant = ref("non-textured");
  const orthoPhoto = ref(false);

  const filteredBuilding = ref([]);
  const filterBuilding = async (payload?: any) => {
    const resp =
      await buildingSurveyMonitoringsApi.get_building_survey_monitoring(
        payload
      );

    const uuid_bgn = resp.data.map((item: any) => item.uuid_bgn);
    return uuid_bgn;
  };
  return {
    getAll3dTiles,
    tiles3dItems,
    upload3dTiles,
    delete3dTiles,
    isFetchingData,
    getDetailBuilding,
    getActiveBuildingFlat,

    update3dTiles,

    popUpBuildingBuilding,
    buildingAttribute,
    attrLoading,

    getActiveBuilding,
    activeBuilding,

    getActiveRoad,
    activeRoad,

    isBuildingActive,
    isTexturedBuildingActive,
    isRoadActive,

    orthoPhoto,
    layer,
    buildingVariant,

    filterBuilding,

    getActiveBuildingCesium,
    activeBuildingCesium,
  };
});
