import buildingSurveyMonitoringsApi from "~/app/api/survey/buildingSurveyMonitorings.api";
import tiles3DApi from "~/app/api/tiles3D.api";
import model3DApi from "~/app/api/view/model3D.api";

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
    const resp = await tiles3DApi.upload_3d_tiles(payload);
  };

  const delete3dTiles = async (id: string) => {
    const resp = await tiles3DApi.delete_3d_tiles(id);
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
  return {
    getAll3dTiles,
    tiles3dItems,
    upload3dTiles,
    delete3dTiles,
    isFetchingData,
    getDetailBuilding,

    popUpBuildingBuilding,
    buildingAttribute,
    attrLoading,

    getActiveBuilding,
    activeBuilding,

    getActiveRoad,
    activeRoad,
  };
});
