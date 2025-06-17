import buildingSurveyApi from "~/app/api/buildingSurvey.api";
import buildingDataConstant from "~/app/constant/buildingData.constant";

export const useBuildingDataStore = defineStore("buildingData", () => {
  const readLotSurveyData = reactive(
    useTableData<ILotSurveyItems, IGetLotSurveyParams>(
      [...buildingDataConstant.table_data.headers!],
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

  // const uploadBuildingData = async (payload: any) => {
  //   const resp = await buildingSurveyApi.post_building_survey_monitorings(
  //     payload
  //   );
  //   console.log(resp);
  //   console.log("pay", payload);
  // };

  return {
    readLotSurveyData,
    uploadBuildingData,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingDataStore, import.meta.hot)
  );
}
