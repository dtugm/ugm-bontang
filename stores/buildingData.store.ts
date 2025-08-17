import buildingSurveyApi from "~/app/api/buildingSurvey.api";
import buildingSurveyMonitoringsApi from "~/app/api/survey/buildingSurveyMonitorings.api";
import buildingDataConstant from "~/app/constant/buildingData.constant";
import {
  buildingConstructionMap,
  buildingTypeMap,
  buildingUpdateMap,
  floorTypeMap,
  taxObjectCode1Map,
  taxObjectCode2Map,
  wallTypeMap,
} from "~/app/constant/data/buildingMapping.constant";
import { apiWrapper } from "~/app/helper/api.helper";
import { RoofType } from "~/app/types/enums/building";

export const useBuildingDataStore = defineStore("buildingData", () => {
  const readBuildingData = reactive(
    useTableData<ILotSurveyItems, IGetBuildingSurveyParams>(
      [...buildingDataConstant.table_data.headers!],
      buildingSurveyApi.building_survey_monitorings
    )
  );
  const readBuldingCollection = reactive(
    useTableData<ILotSurveyItems, IGetLotSurveyParams>(
      [...buildingDataConstant.table_collection.headers!],
      buildingSurveyApi.building_survey_monitorings
    )
  );

  const uploadBuildingData = async (payload: any) => {
    const resp = await buildingSurveyApi.post_building_survey_monitorings(
      payload
    );
    console.log(resp);
    console.log("pay", payload);
  };

  const getBuildingByFilter = async (payload: any) => {
    const resp = await buildingSurveyApi.building_survey_monitorings(payload);
    const ids = resp.data.map((item: any) => item.uuid_bgn);
    return ids;
  };
  const deleteBuildingLoading = ref(false);
  const deleteBuildingData = async (id: string) => {
    deleteBuildingLoading.value = true;
    await apiWrapper(
      () =>
        buildingSurveyMonitoringsApi.delete_building_survey_monitoring({
          id: id,
        }),
      {
        successMessage: "Berhasil menghapus data!",
      }
    );
    deleteBuildingLoading.value = false;
  };
  const editBuildingLoading = ref(false);
  const editBuilding = async (
    id: string,
    payload: { data: Partial<IBuildingObjectType>; images: any }
  ) => {
    editBuildingLoading.value = true;
    console.log(payload);
    await apiWrapper(
      () =>
        buildingSurveyMonitoringsApi.update_building_survey_monitoring(
          { id: id },
          payload
        ),
      {
        successMessage: "Berhasil Mengupdate data!",
      }
    );
    editBuildingLoading.value = false;
  };
  const wallTypeOptions = Object.entries(wallTypeMap).map(([value, title]) => ({
    value,
    title,
  }));
  const buildingTypeOptions = Object.entries(buildingTypeMap).map(
    ([value, title]) => ({
      value,
      title,
    })
  );
  const floorTypeOptions = Object.entries(floorTypeMap).map(
    ([value, title]) => ({
      value,
      title,
    })
  );
  const buildingConstructionOptions = Object.entries(
    buildingConstructionMap
  ).map(([value, title]) => ({
    value,
    title,
  }));
  const buildingUpdateOptions = Object.entries(buildingUpdateMap).map(
    ([value, title]) => ({
      value,
      title,
    })
  );
  const roofTypeOptions = Object.values(RoofType);

  // const uploadBuildingData = async (payload: any) => {
  //   const resp = await buildingSurveyApi.post_building_survey_monitorings(
  //     payload
  //   );
  //   console.log(resp);
  //   console.log("pay", payload);
  // };

  return {
    readBuildingData,
    uploadBuildingData,
    getBuildingByFilter,

    readBuldingCollection,

    deleteBuildingData,
    deleteBuildingLoading,

    editBuilding,
    editBuildingLoading,

    wallTypeOptions,
    buildingTypeOptions,
    floorTypeOptions,
    buildingConstructionOptions,
    buildingUpdateOptions,

    roofTypeOptions,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingDataStore, import.meta.hot)
  );
}
