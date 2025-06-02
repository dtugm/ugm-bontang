import buildingSurveyApi from "~/app/api/buildingSurvey.api";
import lotSurveyApi from "~/app/api/lotSurvey.api";
import vectorsApi from "~/app/api/vectors.api";
import landParcelConstant from "~/app/constant/landParcel.constant";

export const useBuildingDataStore = defineStore("buildingData", () => {
  const readLotSurveyData = reactive(
    useTableData<ILotSurveyItems, IGetLotSurveyParams>(
      [...landParcelConstant.table_data.headers!],
      buildingSurveyApi.building_survey_monitorings
    )
  );

  return {
    readLotSurveyData,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBuildingDataStore, import.meta.hot)
  );
}
